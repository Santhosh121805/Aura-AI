import React from 'react';
import { AgentStatusState, FinalDecision } from '../types';
import { Button } from './ui/Button';

interface DecisionCardProps {
  decision: FinalDecision;
  agents: AgentStatusState[];
  onReviewPublish: () => void;
}

const OUTCOME_LABEL: Record<FinalDecision['outcome'], string> = {
  STRATEGY_READY: 'Strategy Ready',
  WATCH: 'Watch',
  NO_TRADE: 'No Trade',
};

const OUTCOME_COLOR: Record<FinalDecision['outcome'], string> = {
  STRATEGY_READY: 'text-[#31E6A1]',
  WATCH: 'text-[#e2a33d]',
  NO_TRADE: 'text-[#e2543d]',
};

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision, agents, onReviewPublish }) => {
  const completed = agents.filter((a) => a.status === 'complete' && a.signal);
  const bullish = completed.filter((a) => a.signal === 'bullish');
  const bearish = completed.filter((a) => a.signal === 'bearish');
  const neutral = completed.filter((a) => a.signal === 'neutral');
  const riskAgent = agents.find((a) => a.id === 'risk');
  const hasStrategy = !!decision.strategyParameters && decision.assetUniverse.length > 0;

  return (
    <div className="max-w-3xl mx-auto my-12 animate-reveal">
      <div className="mb-8">
        <p className={`text-sm font-semibold uppercase tracking-wide mb-2 ${OUTCOME_COLOR[decision.outcome]}`}>
          {OUTCOME_LABEL[decision.outcome]}
        </p>
        {decision.recommendation && (
          <h3 className="text-2xl sm:text-3xl text-[#F3F1EA] leading-tight">{decision.recommendation}</h3>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#F3F1EA]/10 mb-6">
        <div>
          <p className="text-xs text-[#F3F1EA]/45 mb-1">Confidence</p>
          <p className="text-xl font-data text-[#F3F1EA]">{decision.confidenceScore}%</p>
        </div>
        <div>
          <p className="text-xs text-[#F3F1EA]/45 mb-1">Regime</p>
          <p className="text-sm text-[#F3F1EA]/80 leading-snug">{decision.regime || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-[#F3F1EA]/45 mb-1">Agent vote</p>
          <p className="text-sm text-[#F3F1EA]/80 font-data">{bullish.length} for · {bearish.length} against · {neutral.length} neutral</p>
        </div>
        <div>
          <p className="text-xs text-[#F3F1EA]/45 mb-1">Consensus</p>
          <p className="text-sm text-[#F3F1EA]/80 font-data">{decision.consensusCount}/6 agents</p>
        </div>
      </div>

      {decision.plainEnglishBrief && (
        <p className="text-base text-[#F3F1EA]/75 leading-relaxed mb-8">{decision.plainEnglishBrief}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {bullish.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#F3F1EA]/45 uppercase tracking-wide mb-3">Evidence supporting</p>
            <ul className="space-y-2">
              {bullish.map((a) => (
                <li key={a.id} className="text-sm text-[#F3F1EA]/70 leading-relaxed">
                  <span className="text-[#F3F1EA] font-medium">{a.name}: </span>{a.streamedText}
                </li>
              ))}
            </ul>
          </div>
        )}
        {bearish.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#F3F1EA]/45 uppercase tracking-wide mb-3">Evidence opposing</p>
            <ul className="space-y-2">
              {bearish.map((a) => (
                <li key={a.id} className="text-sm text-[#F3F1EA]/70 leading-relaxed">
                  <span className="text-[#F3F1EA] font-medium">{a.name}: </span>{a.streamedText}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {riskAgent?.streamedText && (
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#F3F1EA]/45 uppercase tracking-wide mb-2">Risk observations</p>
          <p className="text-sm text-[#F3F1EA]/70 leading-relaxed">{riskAgent.streamedText}</p>
        </div>
      )}

      {hasStrategy && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold text-[#F3F1EA]/45 uppercase tracking-wide mb-3">Asset universe</p>
            <div className="flex flex-wrap gap-2">
              {decision.assetUniverse.map((asset) => (
                <span key={asset} className="text-xs font-data px-2.5 py-1 rounded-full border border-[#F3F1EA]/15 text-[#F3F1EA]/70">
                  {asset}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#F3F1EA]/45 uppercase tracking-wide mb-3">Position size</p>
            <p className="text-sm text-[#F3F1EA]/80 font-data">
              {decision.strategyParameters?.positionSize ?? 0}% · {decision.strategyParameters?.timeHorizon || 'no set horizon'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 text-sm text-[#F3F1EA]/55 leading-relaxed">
        <div>
          <p className="text-xs font-semibold text-[#F3F1EA]/45 uppercase tracking-wide mb-2">What would change this</p>
          <p>
            {bearish.length > 0
              ? `If ${bearish.map((a) => a.name).join(' or ')} shift toward agreement, this decision may change.`
              : bullish.length > 0
              ? `If ${bullish.map((a) => a.name).join(' or ')} reverse their read, this decision may change.`
              : 'A shift in any specialist agent\'s read on the market may change this decision.'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#F3F1EA]/45 uppercase tracking-wide mb-2">Suggested review</p>
          <p>Re-run analysis before acting on this if market conditions have moved since it was generated.</p>
        </div>
      </div>

      <Button onClick={onReviewPublish}>Review Decision Receipt</Button>
    </div>
  );
};
