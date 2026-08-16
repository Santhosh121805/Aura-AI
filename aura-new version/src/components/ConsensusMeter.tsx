import React from 'react';

interface ConsensusMeterProps {
  agreeCount: number;
  total?: number;
  isStreaming?: boolean;
}

export const ConsensusMeter: React.FC<ConsensusMeterProps> = ({ 
  agreeCount, 
  total = 6, 
  isStreaming = false 
}) => {
  const percentage = Math.round((agreeCount / total) * 100);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div 
      id="consensus-meter-container"
      className="glass-panel-light rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-500/30 shadow-2xl max-w-4xl mx-auto my-8"
    >
      <div className="flex flex-col text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <h3 className="font-headline font-black text-2xl text-white">
            Consensus Engine
          </h3>
        </div>
        <p className="font-body font-bold text-sm text-[#34d399] mb-1">
          {agreeCount === 6 ? 'Unanimous Alignment' : agreeCount >= 4 ? 'Supermajority Agreement' : 'Divergent Stance'}
        </p>
        <p className="font-body font-semibold text-xs sm:text-sm text-emerald-200/80 max-w-md">
          Agreement level determines recommendation confidence. When 5+ specialist agents align, execution specs are published.
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular SVG Gauge */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="text-emerald-950/60"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="text-[#34d399] transition-all duration-700 ease-out drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-headline font-black text-2xl text-white leading-none">
              {agreeCount}/{total}
            </span>
            <span className="font-body font-bold text-[11px] text-emerald-300/70 mt-0.5">
              Agree
            </span>
          </div>
        </div>

        <div className="hidden xs:flex flex-col gap-1 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            <span className="text-white">{percentage}% Consensus</span>
          </div>
          <div className="text-emerald-300/70">
            Threshold: 80% (5/6)
          </div>
          <div className="text-[#34d399] font-bold">
            {percentage >= 80 ? '✓ Ready to Ship' : 'Waiting for quorum'}
          </div>
        </div>
      </div>
    </div>
  );
};
