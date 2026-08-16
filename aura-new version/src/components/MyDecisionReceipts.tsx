import React, { useState } from 'react';
import { DecisionReceipt, DecisionOutcome } from '../types';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { useWallet } from '../lib/walletContext';
import { 
  Receipt, 
  Copy, 
  Check, 
  ExternalLink, 
  Wallet, 
  AlertTriangle, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';

interface MyDecisionReceiptsProps {
  receipts: DecisionReceipt[];
  onTriggerAnalysis: () => void;
}

export const MyDecisionReceipts: React.FC<MyDecisionReceiptsProps> = ({ 
  receipts, 
  onTriggerAnalysis 
}) => {
  const { wallet, isWrongChain, switchToBotchain, setIsWalletModalOpen, formatAddress } = useWallet();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | DecisionOutcome>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredReceipts = receipts.filter((r) => {
    const matchesFilter = selectedFilter === 'ALL' || r.outcome === selectedFilter;
    const matchesSearch =
      searchQuery === '' ||
      r.recommendation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.plainEnglishBrief.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.decisionHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.transactionHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countAll = receipts.length;
  const countStrategy = receipts.filter((r) => r.outcome === 'STRATEGY_READY').length;
  const countWatch = receipts.filter((r) => r.outcome === 'WATCH').length;
  const countNoTrade = receipts.filter((r) => r.outcome === 'NO_TRADE').length;

  const getStatusBadge = (outcome: DecisionOutcome) => {
    switch (outcome) {
      case 'STRATEGY_READY':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-headline font-bold bg-emerald-500/25 text-[#34d399] border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            STRATEGY READY
          </span>
        );
      case 'WATCH':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-headline font-bold bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40">
            WATCH
          </span>
        );
      case 'NO_TRADE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-headline font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40">
            NO TRADE
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-headline font-bold bg-emerald-500/25 text-[#34d399] border border-emerald-500/40">
            STRATEGY READY
          </span>
        );
    }
  };

  return (
    <section id="receipts" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge mb-3">
            <Receipt className="w-4 h-4 text-[#34d399]" />
            <span className="font-headline font-bold text-xs text-emerald-200">
              Immutable Registry
            </span>
          </div>

          <h2 className="font-headline font-black text-3xl sm:text-4xl lg:text-[2.5rem] text-white text-glow-green text-shadow-video mb-4">
            My Decision Receipts
          </h2>

          <p className="font-body font-bold text-base sm:text-lg text-emerald-100/90 text-shadow-video">
            On-chain cryptographic attestations registered on BOTChain Mainnet (Chain ID: 677).
          </p>
        </div>

        {/* State: Not Connected */}
        {!wallet.isConnected && (
          <div className="glass-panel-light rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] mb-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-[#34d399] mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Wallet className="w-8 h-8" />
            </div>
            <h3 className="font-headline font-black text-2xl text-white mb-2">
              Connect Your Wallet
            </h3>
            <p className="font-body font-semibold text-sm text-emerald-200/80 mb-6">
              Connect your Web3 wallet to verify committee publications and inspect your attestation receipts.
            </p>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-8 py-3.5 rounded-full glowing-green-pill text-[#f8fafc] font-headline font-black text-sm shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* State: Wrong Network */}
        {wallet.isConnected && isWrongChain && (
          <div className="max-w-2xl mx-auto mb-8 p-6 rounded-3xl bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-center text-[#f8fafc] shadow-xl">
            <AlertTriangle className="w-8 h-8 text-[#f59e0b] mx-auto mb-2" />
            <h4 className="font-headline font-black text-xl text-[#f8fafc] mb-1">
              Wrong Network Detected
            </h4>
            <p className="font-body font-semibold text-sm text-[#e2e8f0] mb-4">
              Please switch your wallet to <strong className="text-[#f59e0b]">BOTChain Mainnet (Chain ID: 677)</strong> to interact with the registry.
            </p>
            <button
              onClick={switchToBotchain}
              className="px-6 py-2.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#101418] font-headline font-bold text-sm shadow-lg cursor-pointer"
            >
              Switch to BOTChain (677)
            </button>
          </div>
        )}

        {/* Controls & Filter Tabs */}
        {wallet.isConnected && (
          <div className="flex flex-col md:row items-center justify-between gap-4 mb-8">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 glass-panel-light p-1.5 rounded-2xl border border-emerald-500/30">
              <button
                id="filter-tab-all"
                onClick={() => setSelectedFilter('ALL')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-headline font-bold transition-all cursor-pointer ${
                  selectedFilter === 'ALL'
                    ? 'glowing-green-pill text-white shadow-md'
                    : 'text-emerald-200 hover:bg-white/10'
                }`}
              >
                All Receipts ({countAll})
              </button>

              <button
                id="filter-tab-strategy"
                onClick={() => setSelectedFilter('STRATEGY_READY')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-headline font-bold transition-all cursor-pointer ${
                  selectedFilter === 'STRATEGY_READY'
                    ? 'glowing-green-pill text-white shadow-md'
                    : 'text-emerald-200 hover:bg-white/10'
                }`}
              >
                Strategy Ready ({countStrategy})
              </button>

              <button
                id="filter-tab-watch"
                onClick={() => setSelectedFilter('WATCH')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-headline font-bold transition-all cursor-pointer ${
                  selectedFilter === 'WATCH'
                    ? 'bg-[#f59e0b] text-[#101418] shadow-md font-extrabold'
                    : 'text-emerald-200 hover:bg-white/10'
                }`}
              >
                Watch ({countWatch})
              </button>

              <button
                id="filter-tab-notrade"
                onClick={() => setSelectedFilter('NO_TRADE')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-headline font-bold transition-all cursor-pointer ${
                  selectedFilter === 'NO_TRADE'
                    ? 'bg-[#ef4444] text-white shadow-md'
                    : 'text-emerald-200 hover:bg-white/10'
                }`}
              >
                No Trade ({countNoTrade})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hashes, assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl glass-panel-light border border-emerald-500/30 text-xs sm:text-sm font-body font-semibold text-white placeholder-emerald-400/60 focus:outline-none focus:border-emerald-500"
              />
            </div>

          </div>
        )}

        {/* Empty State */}
        {wallet.isConnected && filteredReceipts.length === 0 && (
          <div className="glass-panel-light rounded-3xl p-12 text-center max-w-xl mx-auto border border-emerald-500/30 shadow-xl">
            <Receipt className="w-12 h-12 text-emerald-400/60 mx-auto mb-3 opacity-60" />
            <h4 className="font-headline font-bold text-xl text-white mb-1">
              No receipts found
            </h4>
            <p className="font-body text-sm font-semibold text-emerald-300/70 mb-6">
              Run an analysis and publish your first committee decision to record it here.
            </p>
            <button
              onClick={onTriggerAnalysis}
              className="px-6 py-2.5 rounded-full glowing-green-pill text-[#f8fafc] font-headline font-bold text-sm shadow-md"
            >
              Run Analysis
            </button>
          </div>
        )}

        {/* Receipts Grid */}
        {wallet.isConnected && filteredReceipts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReceipts.map((receipt) => (
              <div
                key={receipt.id}
                id={`receipt-card-${receipt.id}`}
                className="glass-panel-light rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-emerald-400"
              >
                <div>
                  {/* Top Row: Confidence Circle & Status Badge */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    
                    {/* Confidence Circle */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-emerald-500/60 bg-[#021810]/90 flex flex-col items-center justify-center text-center shadow-[0_0_20px_rgba(16,185,129,0.3)] flex-shrink-0">
                        <span className="font-headline font-black text-xl sm:text-2xl text-[#34d399] text-glow-green leading-none">
                          {receipt.confidenceScore}%
                        </span>
                        <span className="font-body font-bold text-[9px] text-emerald-300/70 uppercase tracking-wider mt-0.5">
                          Confidence
                        </span>
                      </div>
                      
                      <div className="hidden sm:block">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/70 block">
                          Outcome Spec
                        </span>
                        <span className="font-headline font-bold text-sm text-white">
                          AURA Attestation
                        </span>
                      </div>
                    </div>

                    {getStatusBadge(receipt.outcome)}
                  </div>

                  {/* Recommendation Title */}
                  <h3 className="font-headline font-bold text-xl sm:text-2xl text-white mb-3 leading-tight">
                    {receipt.recommendation}
                  </h3>

                  {/* Plain-English Brief */}
                  <p className="font-body font-semibold text-sm text-emerald-200/80 leading-relaxed mb-6 bg-[#021810]/90 p-3.5 rounded-2xl border border-emerald-500/20">
                    {receipt.plainEnglishBrief || receipt.reasoning}
                  </p>
                </div>

                {/* Receipt Details Footer */}
                <div>
                  <div className="space-y-2 py-3 border-t border-emerald-500/20 text-xs font-data mb-4">
                    
                    {/* Decision Hash */}
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-body font-bold text-emerald-300/70">Decision Hash:</span>
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="truncate max-w-[150px] sm:max-w-[200px]">{receipt.decisionHash}</span>
                        <button
                          onClick={() => handleCopy(receipt.decisionHash, `dh-${receipt.id}`)}
                          className="hover:text-[#34d399] transition-colors"
                          title="Copy Decision Hash"
                        >
                          {copiedId === `dh-${receipt.id}` ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Publisher Wallet */}
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-body font-bold text-emerald-300/70">Publisher:</span>
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="truncate max-w-[150px] sm:max-w-[200px]">{receipt.publisher}</span>
                        <button
                          onClick={() => handleCopy(receipt.publisher, `pub-${receipt.id}`)}
                          className="hover:text-[#34d399] transition-colors"
                          title="Copy Publisher Address"
                        >
                          {copiedId === `pub-${receipt.id}` ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Tx Hash */}
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-body font-bold text-emerald-300/70">Tx Hash:</span>
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="truncate max-w-[150px] sm:max-w-[200px]">{receipt.transactionHash}</span>
                        <button
                          onClick={() => handleCopy(receipt.transactionHash, `tx-${receipt.id}`)}
                          className="hover:text-[#34d399] transition-colors"
                          title="Copy Tx Hash"
                        >
                          {copiedId === `tx-${receipt.id}` ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex justify-between items-center">
                      <span className="font-body font-bold text-emerald-300/70">Timestamp:</span>
                      <span className="text-white">
                        {typeof receipt.timestamp === 'string' ? receipt.timestamp : receipt.timestamp.toISOString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Links */}
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
                    <a
                      href={`${BOTCHAIN_CONFIG.explorerUrl}/tx/${receipt.transactionHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-headline font-bold text-xs sm:text-sm text-[#34d399] hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                    >
                      <span>View on Explorer</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleCopy(receipt.decisionHash, `id-${receipt.id}`)}
                      className="font-headline font-bold text-xs sm:text-sm text-emerald-200 hover:text-[#34d399] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{copiedId === `id-${receipt.id}` ? 'Copied Receipt ID!' : 'Copy Receipt ID'}</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
