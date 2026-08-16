import React from 'react';
import { X } from 'lucide-react';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { INITIAL_AGENTS } from '../lib/constants';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 bg-[#0B0D0C]/92 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-[#141715] p-6 sm:p-10 text-[#F3F1EA] relative my-8 max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F3F1EA]/10 transition-colors" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl mb-8">How Aura-AI works</h3>

        <div className="space-y-8 text-sm text-[#F3F1EA]/70 leading-relaxed">
          <div>
            <h4 className="text-[#F3F1EA] font-semibold mb-2">Six specialist agents</h4>
            <ul className="space-y-1.5">
              {INITIAL_AGENTS.map((a) => (
                <li key={a.id}><span className="text-[#F3F1EA]">{a.name}:</span> {a.role}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#F3F1EA] font-semibold mb-2">Consensus</h4>
            <p>The decision engine weighs agreement across all six agents to choose Strategy Ready, Watch, or No Trade. Weaker evidence returns Watch or No Trade rather than forcing a recommendation.</p>
          </div>

          <div>
            <h4 className="text-[#F3F1EA] font-semibold mb-2">On-chain registry</h4>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-data text-xs">
              <dt className="text-[#F3F1EA]/45">Contract</dt><dd>{BOTCHAIN_CONFIG.contractAddress}</dd>
              <dt className="text-[#F3F1EA]/45">Network</dt><dd>{BOTCHAIN_CONFIG.name} · Chain {BOTCHAIN_CONFIG.chainId}</dd>
              <dt className="text-[#F3F1EA]/45">RPC</dt><dd>{BOTCHAIN_CONFIG.rpcUrl}</dd>
              <dt className="text-[#F3F1EA]/45">Explorer</dt><dd>{BOTCHAIN_CONFIG.explorerUrl}</dd>
            </dl>
          </div>

          <div>
            <h4 className="text-[#F3F1EA] font-semibold mb-2">Non-custodial by design</h4>
            <p>Publishing only asks your wallet to sign an attestation. Aura-AI never requests fund transfers, approvals, or your private key.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
