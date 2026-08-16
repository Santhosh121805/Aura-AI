import React from 'react';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#F3F1EA]/8 py-10 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F3F1EA]/45">
        <span>Aura-AI · Explainable on-chain intelligence</span>
        <a
          href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${BOTCHAIN_CONFIG.contractAddress}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 font-data hover:text-[#31E6A1] transition-colors"
        >
          {BOTCHAIN_CONFIG.contractAddress.slice(0, 10)}…{BOTCHAIN_CONFIG.contractAddress.slice(-8)} <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <span>© 2026 Aura-AI</span>
      </div>
    </footer>
  );
};
