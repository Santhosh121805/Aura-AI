import React from 'react';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { ShieldCheck, ExternalLink, Github, Twitter, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#021009]/90 backdrop-blur-xl border-t border-emerald-500/20 py-12 px-4 sm:px-6 lg:px-8 text-xs font-body text-emerald-300/70 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-2">
            <span className="font-headline font-black text-lg text-white text-glow-green">
              AURA-AI
            </span>
            <span className="text-[#34d399] font-bold">· Autonomous Capital Intelligence</span>
          </div>
          <p className="font-semibold text-xs text-emerald-300/60">
            Autonomous, explainable investment committee for on-chain treasury decisions.
          </p>
        </div>

        {/* Center: BOTChain Contract Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#021810]/90 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <ShieldCheck className="w-4 h-4 text-[#34d399]" />
          <div className="text-center sm:text-left">
            <div className="font-data font-semibold text-[11px] text-[#e2e8f0]">
              Contract: <span className="text-[#34d399]">{BOTCHAIN_CONFIG.contractAddress.slice(0, 10)}...{BOTCHAIN_CONFIG.contractAddress.slice(-8)}</span>
            </div>
            <div className="text-[10px] text-emerald-300/60">
              BOTChain Mainnet (Chain ID: 677) · Verified V2
            </div>
          </div>
          <a
            href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${BOTCHAIN_CONFIG.contractAddress}`}
            target="_blank"
            rel="noreferrer"
            className="p-1 text-[#34d399] hover:text-emerald-300 transition-colors"
            title="Inspect on Explorer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Right: Explorer & Legal links */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <a
            href={BOTCHAIN_CONFIG.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#34d399] text-emerald-200 transition-colors flex items-center gap-1"
          >
            <span>BOTChain Scan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://coinmarketcap.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#34d399] text-emerald-200 transition-colors flex items-center gap-1"
          >
            <span>CoinMarketCap</span>
          </a>

          <span className="text-emerald-400/60">© 2026 AURA-AI</span>
        </div>

      </div>
    </footer>
  );
};
