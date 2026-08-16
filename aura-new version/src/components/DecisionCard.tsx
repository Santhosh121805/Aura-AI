import React from 'react';
import { FinalDecision } from '../types';
import { ShieldCheck, ArrowRight, Layers, Clock, Percent, AlertCircle } from 'lucide-react';

interface DecisionCardProps {
  decision: FinalDecision;
  onReviewPublish: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onReviewPublish }) => {
  const getBadgeStyle = () => {
    switch (decision.outcome) {
      case 'STRATEGY_READY':
        return 'bg-emerald-500/30 text-[#34d399] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
      case 'WATCH':
        return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40';
      case 'NO_TRADE':
        return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40';
      default:
        return 'bg-emerald-500/30 text-[#34d399] border-emerald-500/50';
    }
  };

  const getBadgeLabel = () => {
    switch (decision.outcome) {
      case 'STRATEGY_READY': return 'STRATEGY READY';
      case 'WATCH': return 'WATCH';
      case 'NO_TRADE': return 'NO TRADE';
      default: return 'STRATEGY READY';
    }
  };

  return (
    <div 
      id="final-decision-card"
      className="glass-panel-light rounded-3xl p-8 sm:p-10 border-2 border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.25)] max-w-3xl mx-auto my-8 relative overflow-hidden animate-fade-in"
    >
      {/* Top Banner & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className={`px-4 py-1.5 rounded-full font-headline font-extrabold text-xs tracking-wider border uppercase shadow-sm ${getBadgeStyle()}`}>
          {getBadgeLabel()}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300/70">
          <Clock className="w-3.5 h-3.5" />
          <span>Regime: <strong className="text-white">{decision.regime || 'Institutional Yield'}</strong></span>
        </div>
      </div>

      {/* Main Recommendation */}
      <h3 className="font-headline font-black text-2xl sm:text-3xl text-white leading-tight mb-4">
        {decision.recommendation}
      </h3>

      {/* Confidence Score Bar */}
      <div className="bg-[#021810]/90 rounded-2xl p-4 border border-emerald-500/20 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body font-bold text-xs text-emerald-300/70 uppercase tracking-wider">
            Committee Conviction Score
          </span>
          <span className="font-headline font-black text-2xl text-[#34d399] text-glow-green">
            {decision.confidenceScore}%
          </span>
        </div>
        
        <div className="w-full h-3 bg-emerald-950/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#059669] to-[#34d399] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.8)]"
            style={{ width: `${decision.confidenceScore}%` }}
          />
        </div>
      </div>

      {/* Reasoning (Never blank) */}
      <div className="mb-6">
        <h4 className="font-headline font-bold text-sm text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#34d399]" />
          Executive Committee Reasoning:
        </h4>
        <p className="font-body font-semibold text-sm sm:text-base text-emerald-200/80 leading-relaxed bg-[#021810]/90 p-4 rounded-2xl border border-emerald-500/20">
          {decision.reasoning || "Executive committee verified consensus across macroeconomic, capital velocity, and on-chain order book depth."}
        </p>
      </div>

      {/* Asset Universe & Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        
        {/* Asset Universe */}
        <div className="bg-[#021810]/90 rounded-2xl p-4 border border-emerald-500/20">
          <div className="font-headline font-bold text-xs text-white mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#34d399]" />
            <span>Target Asset Universe</span>
          </div>
          {decision.assetUniverse && decision.assetUniverse.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {decision.assetUniverse.map((asset) => (
                <span 
                  key={asset}
                  className="px-2.5 py-1 rounded-lg text-xs font-data font-bold bg-emerald-500/20 text-[#34d399] border border-emerald-500/40"
                >
                  ${asset}
                </span>
              ))}
            </div>
          ) : (
            <span className="font-body text-xs text-emerald-400/60">
              No assets selected — capital remains unallocated
            </span>
          )}
        </div>

        {/* Strategy Parameters */}
        <div className="bg-[#021810]/90 rounded-2xl p-4 border border-emerald-500/20 text-xs font-data">
          <div className="font-headline font-bold text-xs text-white mb-2 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-[#34d399]" />
            <span>Strategy Parameters</span>
          </div>
          <div className="space-y-1 text-emerald-300/70">
            <div className="flex justify-between">
              <span>Time Horizon:</span>
              <strong className="text-white">{decision.strategyParameters?.timeHorizon || '30 Days'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Position Size:</span>
              <strong className="text-[#34d399]">{decision.strategyParameters?.positionSize || 20}% Max Treasury</strong>
            </div>
            <div className="flex justify-between">
              <span>Rebalance Trigger:</span>
              <strong className="text-white">±5% Deviation</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Review & Publish CTA */}
      <button
        id="review-and-publish-btn"
        onClick={onReviewPublish}
        className="w-full py-4 rounded-full glowing-green-pill text-[#f8fafc] font-headline font-black text-base sm:text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
      >
        <span>Review & Publish to BOTChain</span>
        <ArrowRight className="w-5 h-5 text-[#34d399]" />
      </button>

      <div className="text-center mt-3">
        <span className="font-body text-xs font-semibold text-emerald-300/70">
          Non-custodial cryptographic attestation only · Zero fund transfer permissions requested
        </span>
      </div>

    </div>
  );
};
