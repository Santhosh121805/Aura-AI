import React from 'react';
import { X, BookOpen, ShieldCheck, Zap, GitMerge, ExternalLink, Lock } from 'lucide-react';
import { BOTCHAIN_CONFIG } from '../lib/constants';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 bg-[#010b06]/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div 
        id="docs-modal-container"
        className="w-full max-w-3xl rounded-3xl bg-[#03150d]/95 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.3)] p-6 sm:p-10 text-[#f8fafc] relative my-8 max-h-[88vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#f8fafc] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500/20">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-[#34d399] border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline font-extrabold text-2xl text-[#f8fafc]">
              AURA-AI Documentation & Spec
            </h3>
            <p className="font-body text-xs font-semibold text-emerald-300/70">
              Explainable AI Investment Committee for On-Chain Treasuries
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-sm font-body leading-relaxed text-[#e2e8f0]">
          
          {/* Section 1: Overview */}
          <div className="p-5 rounded-2xl bg-[#021810]/90 border border-emerald-500/20">
            <h4 className="font-headline font-bold text-base text-[#34d399] mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#34d399]" /> 1. Executive Philosophy
            </h4>
            <p className="font-semibold text-xs sm:text-sm text-emerald-200/80">
              Aura-AI replaces subjective crypto trading heuristics with a synchronized, six-agent autonomous investment committee. It reads real-time CoinMarketCap data, on-chain DEX and treasury flows, then delivers an explainable allocation strategy verified by cryptographic receipts on BOTChain Mainnet.
            </p>
          </div>

          {/* Section 2: Six Agents */}
          <div className="p-5 rounded-2xl bg-[#021810]/90 border border-emerald-500/20 space-y-3">
            <h4 className="font-headline font-bold text-base text-[#34d399] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#34d399]" /> 2. Six Specialist Agents
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <li className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <strong className="text-white block font-headline">1. Narrative Agent:</strong>
                Scans sector rotations, thematic momentum, and news velocity.
              </li>
              <li className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <strong className="text-white block font-headline">2. Sentiment Agent:</strong>
                Isolates crowd fear & greed index against smart-money wallets.
              </li>
              <li className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <strong className="text-white block font-headline">3. Capital Flow Agent:</strong>
                Tracks non-custodial whales, bridge flows, and DEX pool depth.
              </li>
              <li className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <strong className="text-white block font-headline">4. Macro Agent:</strong>
                Synthesizes interest rate cuts, bond yields, and M2 liquidity.
              </li>
              <li className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <strong className="text-white block font-headline">5. Risk Agent:</strong>
                Calculates liquidation cascades, oracle latency, and stop-loss caps.
              </li>
              <li className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <strong className="text-white block font-headline">6. Strategy Agent:</strong>
                Synthesizes upstream signals and quantifies committee quorum.
              </li>
            </ul>
          </div>

          {/* Section 3: Consensus Gating */}
          <div className="p-5 rounded-2xl bg-[#021810]/90 border border-emerald-500/20">
            <h4 className="font-headline font-bold text-base text-[#34d399] mb-2 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-[#34d399]" /> 3. Consensus Engine & Quorum
            </h4>
            <p className="font-semibold text-xs sm:text-sm text-emerald-200/80 mb-2">
              The committee enforces strict quorum thresholds:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[#34d399] border border-emerald-500/40 font-bold">STRATEGY READY:</span>
                <span>Quorum &ge; 80% (5 or 6 agents agree). Actionable rotation spec issued.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 font-bold">WATCH:</span>
                <span>Quorum &lt; 80% with high volatility. Preserve dry powder in yield stables.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 font-bold">NO TRADE:</span>
                <span>Quorum indicates structural risk or bearish alignment. Capital defense mode.</span>
              </div>
            </div>
          </div>

          {/* Section 4: BOTChain Verification & Smart Contract */}
          <div className="p-5 rounded-2xl bg-[#021810]/90 border border-emerald-500/20">
            <h4 className="font-headline font-bold text-base text-[#34d399] mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#34d399]" /> 4. Smart Contract Specifications
            </h4>
            <div className="font-data text-xs space-y-1 text-emerald-200/80">
              <div><strong>Registry Contract:</strong> <code className="text-[#34d399]">{BOTCHAIN_CONFIG.contractAddress}</code></div>
              <div><strong>Network:</strong> BOTChain Mainnet (Chain ID: 677 / 0x2A5)</div>
              <div><strong>RPC Endpoint:</strong> {BOTCHAIN_CONFIG.rpcUrl}</div>
              <div><strong>Explorer:</strong> {BOTCHAIN_CONFIG.explorerUrl}</div>
            </div>
          </div>

          {/* Section 5: Security */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#34d399] flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-[#34d399] block font-headline text-sm mb-1">Zero-Custody Non-Custodial Architecture:</strong>
              Aura-AI only requires your wallet signature to timestamp and attest the decision on BOTChain. It never has access to your private keys, treasury balances, or fund transfer permissions.
            </div>
          </div>

        </div>

        {/* Footer Button */}
        <div className="mt-8 pt-4 border-t border-emerald-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full glowing-green-pill text-[#f8fafc] font-headline font-bold text-sm shadow-md cursor-pointer"
          >
            Close Spec
          </button>
        </div>

      </div>
    </div>
  );
};
