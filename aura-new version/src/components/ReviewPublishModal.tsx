import React, { useState, useEffect } from 'react';
import { FinalDecision } from '../types';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { estimatePublishGas } from '../lib/contract';
import { useWallet } from '../lib/walletContext';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Fuel, 
  AlertCircle, 
  ArrowRight,
  Lock
} from 'lucide-react';

interface ReviewPublishModalProps {
  decision: FinalDecision | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  isPublishing?: boolean;
}

export const ReviewPublishModal: React.FC<ReviewPublishModalProps> = ({
  decision,
  isOpen,
  onClose,
  onConfirmPublish,
  isPublishing = false,
}) => {
  const { wallet, isWrongChain, switchToBotchain } = useWallet();
  const [copiedContract, setCopiedContract] = useState(false);
  const [gasInfo, setGasInfo] = useState<{ gasCostBOT: string; gasCostUSD: string }>({
    gasCostBOT: '0.000128',
    gasCostUSD: '0.0003',
  });

  useEffect(() => {
    if (decision && isOpen) {
      estimatePublishGas(
        decision.recommendation,
        decision.reasoning,
        decision.confidenceScore,
        decision.plainEnglishBrief
      ).then((res) => {
        setGasInfo({ gasCostBOT: res.gasCostBOT, gasCostUSD: res.gasCostUSD });
      });
    }
  }, [decision, isOpen]);

  if (!isOpen || !decision) return null;

  const handleCopyContract = () => {
    navigator.clipboard.writeText(BOTCHAIN_CONFIG.contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const getBadgeColor = () => {
    switch (decision.outcome) {
      case 'STRATEGY_READY': return 'bg-emerald-500/25 text-[#34d399] border border-emerald-500/40';
      case 'WATCH': return 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40';
      case 'NO_TRADE': return 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40';
      default: return 'bg-emerald-500/25 text-[#34d399] border border-emerald-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#010b06]/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div 
        id="review-publish-modal-content"
        className="w-full max-w-xl rounded-3xl bg-[#03150d]/95 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.25)] p-6 sm:p-8 text-[#f8fafc] relative my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isPublishing}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#f8fafc] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-[#34d399] border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline font-extrabold text-xl sm:text-2xl text-[#f8fafc]">
              Review & Publish Receipt
            </h3>
            <p className="font-body text-xs font-semibold text-emerald-300/70">
              BOTChain Mainnet · AuraStrategyRegistryV2
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="glass-panel-light rounded-2xl p-5 mb-5 text-white border border-emerald-500/30">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-headline font-extrabold tracking-wider ${getBadgeColor()}`}>
              {decision.outcome.replace('_', ' ')}
            </span>
            <span className="font-headline font-black text-xl text-[#34d399] text-glow-green">
              {decision.confidenceScore}% Conviction
            </span>
          </div>

          <h4 className="font-headline font-bold text-lg text-white mb-2">
            {decision.recommendation}
          </h4>

          <p className="font-body font-semibold text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
            {decision.plainEnglishBrief || decision.reasoning.slice(0, 150) + '...'}
          </p>
        </div>

        {/* Contract & Network Details */}
        <div className="bg-[#021810]/90 rounded-2xl p-4 border border-emerald-500/20 space-y-3 mb-5 text-xs font-body">
          
          {/* Contract Target */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-semibold text-emerald-300/70">Publishing Target Contract:</span>
            <div className="flex items-center gap-1.5 font-data text-[#34d399]">
              <span className="truncate max-w-[200px]">{BOTCHAIN_CONFIG.contractAddress}</span>
              <button 
                onClick={handleCopyContract} 
                className="p-1 hover:bg-white/10 rounded transition-colors text-white"
                title="Copy Address"
              >
                {copiedContract ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a 
                href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${BOTCHAIN_CONFIG.contractAddress}`}
                target="_blank" 
                rel="noreferrer"
                className="p-1 hover:bg-white/10 rounded transition-colors text-[#34d399]"
                title="View on Explorer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Network */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-300/70">Target Network:</span>
            <span className="font-data font-bold text-[#f8fafc]">
              {BOTCHAIN_CONFIG.name} (Chain ID: {BOTCHAIN_CONFIG.chainId})
            </span>
          </div>

          {/* Gas Estimate */}
          <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
            <span className="font-semibold text-emerald-300/70 flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-[#34d399]" /> Estimated Gas Fee:
            </span>
            <span className="font-data font-bold text-[#f8fafc]">
              ~{gasInfo.gasCostBOT} BOT (${gasInfo.gasCostUSD})
            </span>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 mb-6 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#34d399] flex-shrink-0 mt-0.5" />
          <div className="font-body text-xs font-semibold text-emerald-200/90 leading-snug">
            <strong className="text-[#34d399]">Non-Custodial Attestation:</strong> No tokens, assets, or permissions will be transferred. Publishing signs an immutable cryptographic proof to the registry on BOTChain.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="w-full sm:w-1/3 py-3.5 rounded-full border border-emerald-500/30 text-[#f8fafc] font-headline font-bold text-sm hover:bg-white/10 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>

          {isWrongChain ? (
            <button
              onClick={switchToBotchain}
              className="w-full sm:w-2/3 py-3.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#101418] font-headline font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Switch to BOTChain (677)</span>
            </button>
          ) : (
            <button
              id="confirm-publish-btn"
              onClick={onConfirmPublish}
              disabled={isPublishing}
              className="w-full sm:w-2/3 py-3.5 rounded-full glowing-green-pill text-[#f8fafc] font-headline font-black text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Publish to BOTChain</span>
              <ArrowRight className="w-5 h-5 text-[#34d399]" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
