import React, { useState, useEffect } from 'react';
import { FinalDecision } from '../types';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { estimatePublishGas } from '../lib/contract';
import { useWallet } from '../lib/walletContext';
import { Button } from './ui/Button';
import { X, Copy, Check, ExternalLink, AlertCircle } from 'lucide-react';

interface ReviewPublishModalProps {
  decision: FinalDecision | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  isPublishing?: boolean;
}

const OUTCOME_LABEL: Record<FinalDecision['outcome'], string> = {
  STRATEGY_READY: 'Strategy Ready',
  WATCH: 'Watch',
  NO_TRADE: 'No Trade',
};

export const ReviewPublishModal: React.FC<ReviewPublishModalProps> = ({
  decision,
  isOpen,
  onClose,
  onConfirmPublish,
  isPublishing = false,
}) => {
  const { wallet, isWrongChain, switchToBotchain, getSigner } = useWallet();
  const [copiedContract, setCopiedContract] = useState(false);
  const [gasInfo, setGasInfo] = useState<{ gasCostBOT: string } | null>(null);
  const [gasLoading, setGasLoading] = useState(false);

  useEffect(() => {
    if (!decision || !isOpen || !wallet.isConnected) {
      setGasInfo(null);
      return;
    }
    let cancelled = false;
    setGasLoading(true);
    setGasInfo(null);
    (async () => {
      const signer = await getSigner();
      const res = await estimatePublishGas(signer, decision.recommendation, decision.reasoning, decision.confidenceScore, decision.plainEnglishBrief);
      if (!cancelled) {
        setGasInfo(res ? { gasCostBOT: res.gasCostBOT } : null);
        setGasLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [decision, isOpen, wallet.isConnected, getSigner]);

  if (!isOpen || !decision) return null;

  const handleCopyContract = () => {
    navigator.clipboard.writeText(BOTCHAIN_CONFIG.contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0B0D0C]/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-[#141715] p-6 sm:p-8 text-[#F3F1EA] relative my-8">
        <button
          onClick={onClose}
          disabled={isPublishing}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F3F1EA]/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold mb-1">Review Decision Receipt</h3>
        <p className="text-xs text-[#F3F1EA]/45 mb-6">This is exactly what will be written on-chain.</p>

        <div className="border-y border-[#F3F1EA]/10 py-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#F3F1EA]">{OUTCOME_LABEL[decision.outcome]}</span>
            <span className="text-sm font-data text-[#31E6A1]">{decision.confidenceScore}%</span>
          </div>
          {decision.recommendation && <p className="text-sm text-[#F3F1EA]/70 mb-2">{decision.recommendation}</p>}
          <p className="text-xs text-[#F3F1EA]/55 leading-relaxed">{decision.plainEnglishBrief}</p>
        </div>

        <dl className="space-y-2.5 text-xs mb-5">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[#F3F1EA]/45">Connected wallet</dt>
            <dd className="font-data text-[#F3F1EA]">{wallet.address ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}` : '—'}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[#F3F1EA]/45">Network</dt>
            <dd className="font-data text-[#F3F1EA]">{BOTCHAIN_CONFIG.name} · Chain {BOTCHAIN_CONFIG.chainId}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[#F3F1EA]/45">Registry contract</dt>
            <dd className="flex items-center gap-1.5 font-data text-[#F3F1EA]">
              <span className="truncate max-w-[160px]">{BOTCHAIN_CONFIG.contractAddress}</span>
              <button onClick={handleCopyContract} className="hover:text-[#31E6A1] transition-colors" title="Copy address">
                {copiedContract ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${BOTCHAIN_CONFIG.contractAddress}`} target="_blank" rel="noreferrer" className="hover:text-[#31E6A1] transition-colors" title="View on explorer">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[#F3F1EA]/45">Estimated gas</dt>
            <dd className="font-data text-[#F3F1EA]">
              {gasInfo ? `~${gasInfo.gasCostBOT} BOT` : gasLoading ? 'Estimating…' : 'Connect wallet to estimate'}
            </dd>
          </div>
        </dl>

        <p className="text-xs text-[#F3F1EA]/50 leading-relaxed mb-6">
          This transaction records a decision receipt. It does not transfer tokens or approve asset access.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="flex-1 py-3 rounded-full border border-[#F3F1EA]/15 text-sm text-[#F3F1EA]/80 hover:border-[#F3F1EA]/30 transition-colors"
          >
            Cancel
          </button>
          {isWrongChain ? (
            <button
              onClick={switchToBotchain}
              className="flex-[2] py-3 rounded-full bg-[#e2a33d] text-[#0B0D0C] text-sm font-semibold flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-4 h-4" /> Switch to BOTChain
            </button>
          ) : (
            <Button onClick={onConfirmPublish} disabled={isPublishing} className="flex-[2]">
              Publish Receipt
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
