export type AgentType = 'narrative' | 'sentiment' | 'capitalFlow' | 'macro' | 'risk' | 'strategy';

export type SignalDirection = 'bullish' | 'bearish' | 'neutral';
export type RiskLevel = 'low' | 'moderate' | 'high';
export type DecisionOutcome = 'STRATEGY_READY' | 'WATCH' | 'NO_TRADE';

export interface AgentSignal {
  signal: SignalDirection;
  conviction: number; // 0-100
  title?: string;
  keyFinding?: string;
  riskLevel?: RiskLevel;
}

export interface AgentStatusState {
  id: AgentType;
  name: string;
  role: string;
  icon: string;
  status: 'idle' | 'running' | 'complete' | 'error';
  streamedText: string;
  signal?: SignalDirection;
  conviction?: number;
  riskLevel?: RiskLevel;
  keyMetric?: string;
  startedAt?: number;
  completedAt?: number;
}

export interface FinalDecision {
  status: 'completed' | 'failed';
  outcome: DecisionOutcome;
  recommendation: string;
  confidenceScore: number; // 0-100
  regime: string;
  reasoning: string;
  plainEnglishBrief: string;
  assetUniverse: string[];
  strategyParameters?: {
    timeHorizon: string;
    positionSize: number;
    rebalanceTrigger?: string;
    stopLossThreshold?: string;
    targetYield?: string;
  };
  consensusCount: number; // e.g. 5 out of 6
  decisionHash: string;
  agentSignals: Record<AgentType, AgentSignal>;
  timestamp: string;
}

export interface DecisionReceipt {
  id: string;
  recommendation: string;
  reasoning: string;
  confidenceScore: number;
  plainEnglishBrief: string;
  decisionHash: string;
  publisher: string;
  timestamp: string | Date;
  transactionHash: string;
  blockNumber?: number;
  outcome: DecisionOutcome;
}

export interface WalletInfo {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  walletName: string | null;
  balanceBOT?: string;
}

export type TxStep = 'idle' | 'waiting_approval' | 'submitted' | 'confirmed' | 'failed';

export interface TxProgressState {
  step: TxStep;
  txHash?: string;
  decisionHash?: string;
  error?: string;
  blockNumber?: number;
  timestamp?: string;
  receipt?: DecisionReceipt;
}
