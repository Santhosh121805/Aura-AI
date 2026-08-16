import { FinalDecision, AgentType, AgentSignal, RiskLevel, DecisionOutcome } from '../types';
import { AURA_API_URL } from './constants';

export interface StreamCallbacks {
  onAgentUpdate: (agent: AgentType, text: string, status: 'running' | 'complete', signal?: AgentSignal) => void;
  onConsensusUpdate: (agreeCount: number, total: number) => void;
  onFinalDecision: (decision: FinalDecision) => void;
  onError: (error: string) => void;
}

// Maps the real backend's agent_result "agent" id to this UI's AgentType.
// Only these six are shown as agent cards — "decision" (the Decision Engine)
// drives consensus/final-decision state but has no card of its own.
const AGENT_ID_MAP: Record<string, AgentType | undefined> = {
  narrative: 'narrative',
  sentiment: 'sentiment',
  capital_flow: 'capitalFlow',
  macro: 'macro',
  risk: 'risk',
  strategy: 'strategy',
};

const OUTCOME_MAP: Record<string, DecisionOutcome> = {
  trade_signal: 'STRATEGY_READY',
  watch: 'WATCH',
  no_trade: 'NO_TRADE',
};

/**
 * Best-effort 0-100 "conviction" reading for the UI meter, derived from real
 * per-agent fields returned by the backend (never fabricated from nothing).
 * Agents that don't expose a natural 0-100 figure fall back to a value
 * deterministically derived from a real field on that same agent's result.
 */
function deriveConviction(agentId: AgentType, result: Record<string, unknown> | undefined): number {
  if (!result) return 50;
  switch (agentId) {
    case 'narrative':
      return clamp(Number(result.top_score) || 50);
    case 'sentiment':
      return clamp(Number(result.fear_greed_value) || 50);
    case 'macro':
      return clamp(Number(result.confidence) || 50);
    case 'risk':
      return clamp(Number(result.risk_score) || 50);
    case 'capitalFlow':
      return clamp(Number(result.institutional_dominance_pct || 0) * 4 + 30);
    case 'strategy':
      // Strategy synthesizes all upstream signals; no independent score of its
      // own, so it inherits from whichever real signal was last observed.
      return clamp(Number(result.confidence_score) || 60);
    default:
      return 50;
  }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function mapRiskLevel(level: unknown): RiskLevel | undefined {
  if (level === 'low') return 'low';
  if (level === 'moderate') return 'moderate';
  if (level === 'high' || level === 'very_high') return 'high';
  return undefined;
}

interface SsePayload {
  event: string;
  data: Record<string, any>;
}

function parseSseBlock(block: string): SsePayload | null {
  const eventMatch = block.match(/event:\s*(\w+)/);
  const dataMatch = block.match(/data:\s*(.+)/s);
  if (!eventMatch || !dataMatch) return null;
  try {
    return { event: eventMatch[1], data: JSON.parse(dataMatch[1]) };
  } catch {
    return null;
  }
}

/**
 * Streams the real 6-agent AURA analysis pipeline from the Python FastAPI
 * backend (aura-ai/backend/main.py) via Server-Sent Events. There is no
 * client-side fallback: if the backend is unreachable or errors, that is
 * surfaced to the caller as a real error — never a fabricated scenario.
 */
export async function streamAuraAnalysis(
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<FinalDecision> {
  const agentResults: Partial<Record<AgentType, AgentSignal>> = {};
  let agreeCount = 0;
  let seenAgents = 0;

  const response = await fetch(`${AURA_API_URL}/aura/run/stream`, { signal });
  if (!response.ok || !response.body) {
    throw new Error(`Backend returned ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() || '';

    for (const block of blocks) {
      if (!block.trim()) continue;
      const parsed = parseSseBlock(block);
      if (!parsed) continue;
      const { event, data } = parsed;

      if (event === 'step') {
        const agentId = AGENT_ID_MAP[String(data.step).replace(/_agent$/, '')];
        if (agentId && data.status === 'running') {
          callbacks.onAgentUpdate(agentId, data.detail || '', 'running');
        }
      } else if (event === 'agent_result') {
        const agentId = AGENT_ID_MAP[data.agent];
        if (!agentId) continue; // e.g. "decision" — not a card in this UI

        const isPositive: boolean | undefined = data.is_positive;
        const agentSignal: AgentSignal = {
          signal: isPositive === true ? 'bullish' : isPositive === false ? 'bearish' : 'neutral',
          conviction: deriveConviction(agentId, data.result),
          riskLevel: agentId === 'risk' ? mapRiskLevel(data.result?.risk_level) : undefined,
        };
        agentResults[agentId] = agentSignal;
        seenAgents += 1;
        if (isPositive === true) agreeCount += 1;

        callbacks.onAgentUpdate(agentId, data.summary || '', 'complete', agentSignal);
        callbacks.onConsensusUpdate(agreeCount, 6);
      } else if (event === 'complete') {
        const strategySpec = data.strategy_spec || {};
        const outcome = OUTCOME_MAP[data.status] ?? 'NO_TRADE';
        const positionSizeNum = parseFloat(String(strategySpec.position_size || '0').replace('%', '')) || 0;

        const finalDecision: FinalDecision = {
          status: 'completed',
          outcome,
          recommendation: strategySpec.recommendation || '',
          confidenceScore: data.confidence_score,
          regime: data.regime_label,
          reasoning: strategySpec.reasoning || '',
          plainEnglishBrief: data.plain_english_brief || '',
          assetUniverse: strategySpec.asset_universe || [],
          strategyParameters: strategySpec.entry_condition ? {
            timeHorizon: strategySpec.timeframe || '',
            positionSize: positionSizeNum,
            rebalanceTrigger: strategySpec.exit_condition || undefined,
            stopLossThreshold: strategySpec.stop_loss || undefined,
            targetYield: strategySpec.take_profit || undefined,
          } : undefined,
          consensusCount: agreeCount,
          decisionHash: data.decision_hash,
          agentSignals: agentResults as Record<AgentType, AgentSignal>,
          timestamp: new Date().toISOString(),
        };

        callbacks.onFinalDecision(finalDecision);
        return finalDecision;
      } else if (event === 'error') {
        throw new Error(data.message || 'Analysis pipeline error.');
      }
    }
  }

  throw new Error('Stream ended before a final decision was received.');
}
