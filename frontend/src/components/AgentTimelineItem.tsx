import React from 'react';
import { AgentStatusState } from '../types';

function evidenceStrength(conviction?: number): string | null {
  if (conviction == null) return null;
  if (conviction >= 75) return 'Strong';
  if (conviction >= 50) return 'Moderate';
  return 'Weak';
}

function statusLabel(status: AgentStatusState['status']): string {
  switch (status) {
    case 'idle': return 'Waiting';
    case 'running': return 'Analyzing';
    case 'complete': return 'Complete';
    case 'error': return 'Error';
  }
}

export const AgentTimelineItem: React.FC<{ agent: AgentStatusState }> = ({ agent }) => {
  const strength = agent.status === 'complete' ? evidenceStrength(agent.conviction) : null;
  const isRunning = agent.status === 'running';
  const isComplete = agent.status === 'complete';

  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#F3F1EA]/8 last:border-0">
      <span
        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
          isComplete ? 'bg-[#31E6A1]' : isRunning ? 'bg-[#31E6A1] animate-pulse' : 'bg-[#F3F1EA]/20'
        }`}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="text-sm font-medium text-[#F3F1EA]">{agent.name}</span>
          <span className={`text-xs font-data shrink-0 ${isComplete ? 'text-[#31E6A1]' : 'text-[#F3F1EA]/45'}`}>
            {statusLabel(agent.status)}
          </span>
        </div>
        {agent.streamedText && (
          <p className="text-sm text-[#F3F1EA]/65 leading-relaxed">{agent.streamedText}</p>
        )}
        {strength && (
          <p className="text-xs text-[#F3F1EA]/40 font-data mt-1">Evidence: {strength}</p>
        )}
      </div>
    </div>
  );
};
