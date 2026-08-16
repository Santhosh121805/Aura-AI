import React, { useState, useRef } from 'react';
import { AgentStatusState, FinalDecision, AgentType, AgentSignal } from '../types';
import { INITIAL_AGENTS } from '../lib/constants';
import { streamAuraAnalysis } from '../lib/api';
import { useWallet } from '../lib/walletContext';
import { AgentCard } from './AgentCard';
import { ConsensusMeter } from './ConsensusMeter';
import { DecisionCard } from './DecisionCard';
import { Play, RotateCcw, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

interface LiveAnalysisSectionProps {
  onReviewPublish: (decision: FinalDecision) => void;
}

export const LiveAnalysisSection: React.FC<LiveAnalysisSectionProps> = ({ onReviewPublish }) => {
  const { wallet, setIsWalletModalOpen } = useWallet();
  const [agents, setAgents] = useState<AgentStatusState[]>(INITIAL_AGENTS);
  const [isStreaming, setIsStreaming] = useState(false);
  const [agreeCount, setAgreeCount] = useState(0);
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
    setAgreeCount(0);
    setIsStreaming(true);

    // Reset agents to idle
    setAgents(INITIAL_AGENTS.map((a) => ({ ...a, status: 'idle', streamedText: '', signal: undefined })));

    abortControllerRef.current = new AbortController();

    try {
      await streamAuraAnalysis(
        {
          onAgentUpdate: (agentId: AgentType, text: string, status: 'running' | 'complete', signal?: AgentSignal) => {
            setAgents((prev) =>
              prev.map((agent) => {
                if (agent.id === agentId) {
                  return {
                    ...agent,
                    status,
                    streamedText: text,
                    signal: signal?.signal || agent.signal,
                    conviction: signal?.conviction || agent.conviction,
                    riskLevel: signal?.riskLevel || agent.riskLevel,
                  };
                }
                return agent;
              })
            );
          },
          onConsensusUpdate: (count: number) => {
            setAgreeCount(count);
          },
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
      if (err?.message !== 'Stream aborted') {
        console.error('Analysis error:', err);
        setStreamError('Analysis encountered a signal stream anomaly. Please retry.');
      }
      setIsStreaming(false);
    }
  };

  const handleStopAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
  };

  const hasStarted = isStreaming || finalDecision !== null || agents.some((a) => a.status !== 'idle');

  return (
    <section id="live" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-badge mb-3 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Sparkles className="w-4 h-4 text-[#34d399]" />
            <span className="font-headline font-bold text-xs text-[#34d399]">
              Live Execution Engine
            </span>
          </div>

          <h2 className="font-headline font-black text-3xl sm:text-4xl lg:text-[2.5rem] text-[#f8fafc] text-shadow-video mb-4">
            Run Analysis
          </h2>

          <p className="font-body font-semibold text-base sm:text-lg text-emerald-100/90 text-shadow-subtle">
            Trigger parallel 6-agent real-time consensus across narrative, sentiment, capital flow, macro, and risk.
          </p>
        </div>

        {/* Initial CTA Box (When not started) */}
        {!hasStarted && (
          <div className="glass-panel-light rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto border border-emerald-500/30 shadow-2xl mb-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-[#34d399] mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="font-headline font-black text-2xl text-white mb-3">
              Ready for Committee Evaluation
            </h3>

            <p className="font-body font-semibold text-sm sm:text-base text-emerald-200/80 leading-relaxed mb-8">
              Connect your wallet and click <strong className="text-white">"Run Analysis"</strong> to stream live AI decision-making across all six specialist agents in real-time.
            </p>

            <button
              id="live-run-analysis-primary-btn"
              onClick={startAnalysis}
              className="px-8 py-3.5 glowing-green-pill text-[#f8fafc] font-headline font-extrabold text-base flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#34d399]" />
              <span>Run Analysis</span>
            </button>
          </div>
        )}

        {/* Action Controls when running / finished */}
        {hasStarted && (
          <div className="flex items-center justify-center gap-4 mb-10">
            {isStreaming ? (
              <button
                onClick={handleStopAnalysis}
                className="px-6 py-2.5 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-[#f8fafc] font-headline font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Stop Stream</span>
              </button>
            ) : (
              <button
                id="live-run-again-btn"
                onClick={startAnalysis}
                className="px-7 py-3 glowing-green-pill text-[#f8fafc] font-headline font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#34d399]" />
                <span>Run New Analysis</span>
              </button>
            )}
          </div>
        )}

        {/* Error Alert */}
        {streamError && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] font-body text-sm font-bold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{streamError}</span>
          </div>
        )}

        {/* 6 Agent Cards Stream Grid */}
        {hasStarted && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            {/* Consensus Meter */}
            <ConsensusMeter agreeCount={agreeCount} isStreaming={isStreaming} />

            {/* Final Decision Card (Appears upon completion) */}
            {finalDecision && (
              <DecisionCard
                decision={finalDecision}
                onReviewPublish={() => onReviewPublish(finalDecision)}
              />
            )}
          </>
        )}

      </div>
    </section>
  );
};
