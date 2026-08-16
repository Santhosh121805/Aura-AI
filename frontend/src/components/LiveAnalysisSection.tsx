import React, { useState, useRef } from 'react';
import { AgentStatusState, FinalDecision, AgentType, AgentSignal } from '../types';
import { INITIAL_AGENTS, VIDEO_CONFIG } from '../lib/constants';
import { streamAuraAnalysis } from '../lib/api';
import { useWallet } from '../lib/walletContext';
import { AgentTimelineItem } from './AgentTimelineItem';
import { DecisionCard } from './DecisionCard';
import { Section } from './ui/Section';
import { Eyebrow } from './ui/Eyebrow';
import { Button } from './ui/Button';
import { AlertTriangle, Square } from 'lucide-react';

interface LiveAnalysisSectionProps {
  onReviewPublish: (decision: FinalDecision) => void;
}

export const LiveAnalysisSection: React.FC<LiveAnalysisSectionProps> = ({ onReviewPublish }) => {
  const { wallet, setIsWalletModalOpen } = useWallet();
  const [agents, setAgents] = useState<AgentStatusState[]>(INITIAL_AGENTS);
  const [isStreaming, setIsStreaming] = useState(false);
  const [finalDecision, setFinalDecision] = useState<FinalDecision | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startAnalysis = async () => {
    if (!wallet.isConnected) {
      setIsWalletModalOpen(true);
      return;
    }

    setStreamError(null);
    setFinalDecision(null);
    setIsStreaming(true);
    setAgents(INITIAL_AGENTS.map((a) => ({ ...a, status: 'idle', streamedText: '', signal: undefined })));

    abortControllerRef.current = new AbortController();

    try {
      await streamAuraAnalysis(
        {
          onAgentUpdate: (agentId: AgentType, text: string, status: 'running' | 'complete', signal?: AgentSignal) => {
            setAgents((prev) =>
              prev.map((agent) =>
                agent.id === agentId
                  ? {
                      ...agent,
                      status,
                      streamedText: text,
                      signal: signal?.signal ?? agent.signal,
                      conviction: signal?.conviction ?? agent.conviction,
                      riskLevel: signal?.riskLevel ?? agent.riskLevel,
                    }
                  : agent
              )
            );
          },
          onConsensusUpdate: () => {},
          onFinalDecision: (decision: FinalDecision) => {
            setFinalDecision(decision);
            setIsStreaming(false);
          },
          onError: (err: string) => {
            setStreamError(err);
            setIsStreaming(false);
          },
        },
        abortControllerRef.current.signal
      );
    } catch (err: any) {
      if (err?.name !== 'AbortError' && err?.message !== 'Stream aborted') {
        console.error('Analysis error:', err);
        setStreamError(err?.message || 'Analysis pipeline failed. Please retry.');
      }
      setIsStreaming(false);
    }
  };

  const handleStopAnalysis = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  };

  const hasStarted = isStreaming || finalDecision !== null || agents.some((a) => a.status !== 'idle');

  return (
    <Section id="live">
      <Eyebrow className="mb-3">Live analysis</Eyebrow>

      {!hasStarted && (
        <div className="max-w-xl mx-auto text-center py-12">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full overflow-hidden">
            <img src={VIDEO_CONFIG.poster} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <h2 className="text-2xl sm:text-3xl text-[#F3F1EA] mb-3">Ready to analyze the market</h2>
          <p className="text-sm text-[#F3F1EA]/60 mb-8 leading-relaxed">
            Run the six-agent pipeline live. Each agent reports its own read before the engine reaches consensus.
          </p>
          <Button onClick={startAnalysis}>Run Analysis</Button>
        </div>
      )}

      {hasStarted && (
        <>
          <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
            <h2 className="text-xl text-[#F3F1EA]">Analysis timeline</h2>
            {isStreaming ? (
              <button
                onClick={handleStopAnalysis}
                className="flex items-center gap-2 text-sm text-[#e2543d] hover:underline"
              >
                <Square className="w-3.5 h-3.5" aria-hidden="true" /> Stop
              </button>
            ) : (
              <button onClick={startAnalysis} className="text-sm text-[#31E6A1] hover:underline">
                Run again
              </button>
            )}
          </div>

          {streamError && (
            <div className="max-w-2xl mx-auto mb-6 flex items-start gap-2.5 text-sm text-[#e2543d]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{streamError}</span>
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            {agents.map((agent) => (
              <AgentTimelineItem key={agent.id} agent={agent} />
            ))}
          </div>

          {finalDecision && (
            <DecisionCard
              decision={finalDecision}
              agents={agents}
              onReviewPublish={() => onReviewPublish(finalDecision)}
            />
          )}
        </>
      )}
    </Section>
  );
};
