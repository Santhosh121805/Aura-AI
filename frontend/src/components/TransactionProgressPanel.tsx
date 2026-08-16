import React, { useEffect, useState } from 'react';
import { TxProgressState } from '../types';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { Button } from './ui/Button';
import confetti from 'canvas-confetti';
import { Loader2, CheckCircle2, XCircle, Copy, Check, ExternalLink } from 'lucide-react';

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

  useEffect(() => {
    if (txState.step === 'confirmed') {
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#31E6A1', '#F3F1EA'] });
      } catch (e) {
        console.error(e);
      }
    }
  }, [txState.step]);

  if (txState.step === 'idle') return null;

  const handleCopyTx = () => {
    if (!txState.txHash) return;
    navigator.clipboard.writeText(txState.txHash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-[#0B0D0C]/92 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-[#141715] p-8 text-[#F3F1EA] text-center">
        {txState.step === 'waiting_approval' && (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-7 h-7 text-[#31E6A1] animate-spin mb-5" />
            <h3 className="text-xl mb-1.5">Waiting for wallet approval</h3>
            <p className="text-sm text-[#F3F1EA]/55">Sign the request in your connected wallet.</p>
          </div>
        )}

        {txState.step === 'submitted' && (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-7 h-7 text-[#31E6A1] animate-spin mb-5" />
            <h3 className="text-xl mb-1.5">Confirming on BOTChain</h3>
            {txState.txHash && (
              <div className="w-full mt-4 mb-2 flex items-center justify-between gap-2 text-xs font-data text-[#F3F1EA]/70 border border-[#F3F1EA]/10 rounded-xl px-3 py-2.5">
                <span className="truncate">{txState.txHash}</span>
                <button onClick={handleCopyTx}>{copiedTx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}</button>
              </div>
            )}
          </div>
        )}

        {txState.step === 'confirmed' && (
          <div className="flex flex-col items-center py-2 animate-verify-pulse rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-[#31E6A1] mb-4" />
            <h3 className="text-xl mb-1.5">Receipt published</h3>
            <p className="text-sm text-[#F3F1EA]/55 mb-6">Recorded on BOTChain Mainnet.</p>

            {txState.txHash && (
              <div className="w-full text-left text-xs space-y-2 mb-6 border-t border-[#F3F1EA]/10 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#F3F1EA]/45">Transaction hash</span>
                  <span className="font-data text-[#F3F1EA] truncate max-w-[180px]">{txState.txHash}</span>
                </div>
                <a
                  href={`${BOTCHAIN_CONFIG.explorerUrl}/tx/${txState.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#31E6A1] hover:underline"
                >
                  View on BOTChain Explorer <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="w-full flex items-center gap-3">
              <Button onClick={onViewReceipt} className="flex-1">View Receipt</Button>
              <button onClick={onReset} className="flex-1 py-3 rounded-full border border-[#F3F1EA]/15 text-sm hover:border-[#F3F1EA]/30 transition-colors">
                Run another
              </button>
            </div>
          </div>
        )}

        {txState.step === 'failed' && (
          <div className="flex flex-col items-center py-4">
            <XCircle className="w-7 h-7 text-[#e2543d] mb-5" />
            <h3 className="text-xl mb-1.5">Failed or rejected</h3>
            <p className="text-sm text-[#F3F1EA]/55 mb-6">{txState.error || 'The wallet request was cancelled.'}</p>
            <div className="w-full flex items-center gap-3">
              <button onClick={onReset} className="flex-1 py-3 rounded-full border border-[#F3F1EA]/15 text-sm hover:border-[#F3F1EA]/30 transition-colors">
                Cancel
              </button>
              <Button onClick={onRetry} className="flex-1">Try again</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
