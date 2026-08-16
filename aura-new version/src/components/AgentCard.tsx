import React from 'react';
import { AgentStatusState } from '../types';
import { 
  Sparkles, 
  Activity, 
  TrendingUp, 
  Globe, 
  ShieldAlert, 
  Zap, 
  CheckCircle, 
  Loader2, 
  Clock,
  TrendingDown,
  Minus
} from 'lucide-react';

interface AgentCardProps {
  agent: AgentStatusState;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'narrative': return Sparkles;
      case 'sentiment': return Activity;
      case 'capitalFlow': return TrendingUp;
      case 'macro': return Globe;
      case 'risk': return ShieldAlert;
      case 'strategy': return Zap;
      default: return Sparkles;
    }
  };

  const Icon = getIcon(agent.id);

  const getSignalBadge = () => {
    if (!agent.signal) return null;

    if (agent.signal === 'bullish') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-[#34d399] border border-emerald-500/40">
          <TrendingUp className="w-3.5 h-3.5" /> Bullish ({agent.conviction || 85}%)
        </span>
      );
    } else if (agent.signal === 'bearish') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40">
          <TrendingDown className="w-3.5 h-3.5" /> Bearish ({agent.conviction || 80}%)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
          <Minus className="w-3.5 h-3.5" /> Neutral ({agent.conviction || 60}%)
        </span>
      );
    }
  };

  return (
    <div 
      id={`agent-card-${agent.id}`}
      className={`glass-panel-light rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between border ${
        agent.status === 'running' 
          ? 'border-[#34d399] ring-2 ring-[#34d399]/50 shadow-[0_0_25px_rgba(16,185,129,0.35)]' 
          : agent.status === 'complete' 
          ? 'border-emerald-500/40' 
          : 'border-emerald-500/20 opacity-85'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              agent.status === 'running'
                ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                : agent.status === 'complete'
                ? 'bg-emerald-500/25 text-[#34d399]'
                : 'bg-emerald-950/40 text-emerald-400'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-base text-white">
                {agent.name}
              </h4>
              <p className="font-body text-xs font-semibold text-emerald-300/70">
                {agent.role}
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div>
            {agent.status === 'idle' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300/70 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Clock className="w-3.5 h-3.5" /> Waiting
              </span>
            )}
            {agent.status === 'running' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#34d399] bg-emerald-500/25 px-2.5 py-1 rounded-full border border-emerald-500/50 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
              </span>
            )}
            {agent.status === 'complete' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#34d399] bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/40">
                <CheckCircle className="w-3.5 h-3.5" /> Complete
              </span>
            )}
          </div>
        </div>

        {/* Live Output Box */}
        <div className="min-h-[110px] max-h-[140px] overflow-y-auto bg-[#021810]/90 rounded-2xl p-3.5 border border-emerald-500/20 text-xs font-body font-semibold text-emerald-100 leading-relaxed mb-3">
          {agent.status === 'idle' && (
            <span className="text-emerald-400/60 italic">
              Standing by for market ingestion trigger...
            </span>
          )}
          {agent.status === 'running' && (
            <div className="space-y-1">
              <span className="text-emerald-100">{agent.streamedText}</span>
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#34d399] animate-pulse align-middle" />
            </div>
          )}
          {agent.status === 'complete' && (
            <span className="text-emerald-100">{agent.streamedText}</span>
          )}
        </div>
      </div>

      {/* Signal / Conviction Footer */}
      <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
        <span className="font-body text-xs font-bold text-emerald-300/70">
          Signal Assessment:
        </span>
        <div>
          {agent.status === 'complete' ? (
            getSignalBadge()
          ) : (
            <span className="font-data text-xs text-emerald-400/50">--</span>
          )}
        </div>
      </div>
    </div>
  );
};
