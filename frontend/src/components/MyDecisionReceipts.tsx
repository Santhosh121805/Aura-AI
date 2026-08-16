import React, { useState } from 'react';
import { DecisionReceipt, DecisionOutcome } from '../types';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { useWallet } from '../lib/walletContext';
import { Section } from './ui/Section';
import { Eyebrow } from './ui/Eyebrow';
import { Button } from './ui/Button';
import { Copy, Check, ExternalLink, Search } from 'lucide-react';

interface MyDecisionReceiptsProps {
  receipts: DecisionReceipt[];
  onTriggerAnalysis: () => void;
}

const OUTCOME_LABEL: Record<DecisionOutcome, string> = {
  STRATEGY_READY: 'Strategy Ready',
  WATCH: 'Watch',
  NO_TRADE: 'No Trade',
};

const FILTERS: Array<'ALL' | DecisionOutcome> = ['ALL', 'STRATEGY_READY', 'WATCH', 'NO_TRADE'];

export const MyDecisionReceipts: React.FC<MyDecisionReceiptsProps> = ({ receipts, onTriggerAnalysis }) => {
  const { wallet, isWrongChain, switchToBotchain, connectWallet, formatAddress } = useWallet();
  const [filter, setFilter] = useState<'ALL' | DecisionOutcome>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = receipts.filter((r) => {
    const matchesFilter = filter === 'ALL' || r.outcome === filter;
    const q = query.toLowerCase();
    const matchesQuery = q === '' || r.recommendation.toLowerCase().includes(q) || r.decisionHash.toLowerCase().includes(q) || r.transactionHash.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <Section id="receipts">
      <Eyebrow className="mb-3">My receipts</Eyebrow>
      <h2 className="text-3xl text-[#F3F1EA] mb-10">Published decisions</h2>

      {!wallet.isConnected ? (
        <div className="max-w-xl py-6">
          <p className="text-sm text-[#F3F1EA]/60 mb-5">Connect your wallet to view receipts you've published.</p>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </div>
      ) : isWrongChain ? (
        <div className="max-w-xl py-6">
          <p className="text-sm text-[#e2a33d] mb-5">Switch to BOTChain Mainnet to view your receipts.</p>
          <button onClick={switchToBotchain} className="px-5 py-2.5 rounded-full bg-[#e2a33d] text-[#0B0D0C] text-sm font-semibold">
            Switch to BOTChain
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="text-sm text-[#F3F1EA]/55 font-data">
              {formatAddress(wallet.address)} · {receipts.length} receipt{receipts.length === 1 ? '' : 's'}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#F3F1EA]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search receipts"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-full bg-[#141715] border border-[#F3F1EA]/10 text-xs text-[#F3F1EA] placeholder-[#F3F1EA]/35 focus:outline-none focus:border-[#31E6A1]/50"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === f ? 'bg-[#31E6A1] text-[#0B0D0C]' : 'text-[#F3F1EA]/55 hover:text-[#F3F1EA] border border-[#F3F1EA]/10'
                }`}
              >
                {f === 'ALL' ? 'All' : OUTCOME_LABEL[f]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-[#F3F1EA]/55 mb-6">No receipts yet.</p>
              <Button onClick={onTriggerAnalysis}>Run Analysis</Button>
            </div>
          ) : (
            <div className="divide-y divide-[#F3F1EA]/8">
              {filtered.map((r) => (
                <div key={r.id} className="py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="sm:w-32 shrink-0">
                    <span className="text-xs font-semibold text-[#F3F1EA]/70">{OUTCOME_LABEL[r.outcome]}</span>
                    <p className="text-xs font-data text-[#31E6A1]">{r.confidenceScore}%</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F3F1EA] truncate">{r.recommendation || r.plainEnglishBrief}</p>
                    <p className="text-xs text-[#F3F1EA]/40 font-data">
                      {typeof r.timestamp === 'string' ? new Date(r.timestamp).toLocaleString() : r.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-data text-[#F3F1EA]/50 shrink-0">
                    <button onClick={() => handleCopy(r.decisionHash, `dh-${r.id}`)} className="flex items-center gap-1 hover:text-[#F3F1EA] transition-colors" title="Copy decision hash">
                      {copiedId === `dh-${r.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} hash
                    </button>
                    <a
                      href={`${BOTCHAIN_CONFIG.explorerUrl}/tx/${r.transactionHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-[#31E6A1] transition-colors"
                    >
                      explorer <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  );
};
