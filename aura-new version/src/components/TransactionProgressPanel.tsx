import React, { useEffect, useState } from 'react';
import { TxProgressState } from '../types';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import confetti from 'canvas-confetti';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface TransactionProgressPanelProps {
  txState: TxProgressState;
  onViewReceipt: () => void;
  onReset: () => void;
  onRetry: () => void;
}

export const TransactionProgressPanel: React.FC<TransactionProgressPanelProps> = ({
  txState,
  onViewReceipt,
  onReset,
  onRetry,
}) => {
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedDecision, setCopiedDecision] = useState(false);

  useEffect(() => {
    if (txState.step === 'confirmed') {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#34d399', '#10b981', '#059669', '#f8fafc', '#6ee7b7'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [txState.step]);

  if (txState.step === 'idle') return null;

  const handleCopyTx = () => {
    if (txState.txHash) {
      navigator.clipboard.writeText(txState.txHash);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  const handleCopyDecision = () => {
    if (txState.decisionHash) {
      navigator.clipboard.writeText(txState.decisionHash);
      setCopiedDecision(true);
      setTimeout(() => setCopiedDecision(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-[#010b06]/90 backdrop-blur-xl animate-fade-in">
      <div 
        id="tx-progress-panel"
        className="w-full max-w-lg rounded-3xl bg-[#03150d]/95 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.3)] p-6 sm:p-8 text-[#f8fafc] text-center relative"
      >
        
        {/* STATE 1: Waiting for Wallet Approval */}
        {txState.step === 'waiting_approval' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] mb-4 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="font-headline font-black text-2xl text-[#f8fafc] mb-2">
              Waiting for Wallet Approval...
            </h3>
            <p className="font-body font-bold text-sm text-[#f59e0b] mb-4">
              Please sign the attestation prompt in your wallet
            </p>
            <p className="font-body text-xs text-emerald-300/70 max-w-xs">
              No funds or approvals are requested. This signature authenticates the decision receipt.
            </p>
          </div>
        )}

        {/* STATE 2: Transaction Submitted */}
        {txState.step === 'submitted' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-[#34d399] mb-4 animate-spin shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Loader2 className="w-8 h-8" />
            </div>
            <h3 className="font-headline font-black text-2xl text-[#f8fafc] mb-2">
              Transaction Submitted
            </h3>
            <p className="font-body font-bold text-sm text-[#34d399] mb-6">
              Confirming on BOTChain Mainnet (Chain ID: 677)...
            </p>

            {txState.txHash && (
              <div className="w-full bg-[#021810]/90 rounded-2xl p-4 border border-emerald-500/20 text-left mb-4">
                <div className="text-[11px] font-semibold text-emerald-300/70 mb-1">Transaction Hash</div>
                <div className="flex items-center justify-between gap-2 font-data text-xs text-[#f8fafc]">
                  <span className="truncate">{txState.txHash}</span>
                  <button onClick={handleCopyTx} className="p-1 hover:bg-white/10 rounded">
                    {copiedTx ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300/70">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-ping" />
              <span>Waiting for 1 block confirmation</span>
            </div>
          </div>
        )}

        {/* STATE 3: Success (Approved & Published!) */}
        {txState.step === 'confirmed' && (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-[#34d399] mb-4 shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-emerald-500/40">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-headline font-black text-2xl sm:text-3xl text-[#f8fafc] mb-1">
              Approved & Published!
            </h3>
            <p className="font-body font-bold text-sm text-[#34d399] mb-6">
              Your decision has been recorded on-chain forever.
            </p>

            {/* Receipt Summary Card */}
            <div className="w-full glass-panel-light rounded-2xl p-4 sm:p-5 text-left text-white border border-emerald-500/30 space-y-2.5 mb-6 text-xs">
              
              <div className="flex justify-between items-center pb-2 border-b border-emerald-500/20">
                <span className="font-bold text-emerald-300/70">Block Status:</span>
                <span className="font-data font-bold text-[#34d399] bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Finalized on block #{txState.blockNumber || '4893120'}
                </span>
              </div>

              {txState.txHash && (
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-emerald-300/70">Tx Hash:</span>
                  <div className="flex items-center gap-1.5 font-data text-white">
                    <span className="truncate max-w-[170px]">{txState.txHash}</span>
                    <button onClick={handleCopyTx} title="Copy Tx Hash">
                      {copiedTx ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`${BOTCHAIN_CONFIG.explorerUrl}/tx/${txState.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#34d399] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {txState.decisionHash && (
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-emerald-300/70">Decision Hash:</span>
                  <div className="flex items-center gap-1.5 font-data text-white">
                    <span className="truncate max-w-[170px]">{txState.decisionHash}</span>
                    <button onClick={handleCopyDecision} title="Copy Decision Hash">
                      {copiedDecision ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="font-bold text-emerald-300/70">Contract:</span>
                <span className="font-data font-bold text-white truncate max-w-[190px]">
                  {BOTCHAIN_CONFIG.contractAddress}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-emerald-300/70">Timestamp:</span>
                <span className="font-data text-white">
                  {new Date().toISOString()}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-3">
              <button
                id="view-receipt-action-btn"
                onClick={onViewReceipt}
                className="w-full sm:w-1/2 py-3.5 rounded-full glowing-green-pill text-[#f8fafc] font-headline font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Receipt</span>
                <ArrowRight className="w-4 h-4 text-[#34d399]" />
              </button>

              <button
                onClick={onReset}
                className="w-full sm:w-1/2 py-3.5 rounded-full border border-emerald-500/30 hover:bg-white/10 text-[#f8fafc] font-headline font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-[#34d399]" />
                <span>Run Another Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE 4: Error / Rejection */}
        {txState.step === 'failed' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-[#ef4444]/20 flex items-center justify-center text-[#ef4444] mb-4">
              <XCircle className="w-8 h-8" />
            </div>

            <h3 className="font-headline font-black text-2xl text-[#f8fafc] mb-2">
              Transaction Rejected / Failed
            </h3>

            <p className="font-body font-semibold text-sm text-[#ef4444] mb-6 max-w-sm">
              {txState.error || 'The wallet signature request was cancelled or rejected.'}
            </p>

            <div className="w-full flex items-center gap-3">
              <button
                onClick={onReset}
                className="w-1/2 py-3 rounded-full border border-emerald-500/30 text-[#f8fafc] font-headline font-bold text-sm hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onRetry}
                className="w-1/2 py-3 rounded-full glowing-green-pill text-[#f8fafc] font-headline font-bold text-sm shadow-xl cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
