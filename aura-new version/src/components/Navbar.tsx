import React, { useState } from 'react';
import { useWallet } from '../lib/walletContext';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { ShieldCheck, Wallet, Receipt, AlertTriangle, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenReceipts: () => void;
  onOpenDocs: () => void;
  onScrollTo: (sectionId: string) => void;
  onShowIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReceipts, onOpenDocs, onScrollTo, onShowIntro }) => {
  const {
    wallet,
    isWrongChain,
    isSwitchingChain,
    switchToBotchain,
    formatAddress,
    setIsWalletModalOpen,
    disconnectWallet
  } = useWallet();

  const [showWalletMenu, setShowWalletMenu] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-none">
      <div className="pointer-events-auto h-14 sm:h-16 px-4 sm:px-6 rounded-full bg-[#040e08]/90 backdrop-blur-xl border border-emerald-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.12)] flex items-center justify-between transition-all">
        
        {/* Left: AURA-AI logo + wordmark */}
        <div 
          onClick={() => {
            if (onShowIntro) {
              onShowIntro();
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="navbar-brand-logo"
        >
          {/* Glowing Crest Icon */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#34d399] via-[#10b981] to-[#047857] p-[1.5px] shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-[#021f15] rounded-[10px] flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" strokeOpacity="0.4" strokeDasharray="3 3" />
                <path d="M12 3v4M12 17v4M3 12h4M17 12h4" strokeOpacity="0.8" />
                <polygon points="12,7 15,12 12,17 9,12" fill="#34d399" fillOpacity="0.5" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-headline font-black text-lg sm:text-xl text-[#f8fafc] tracking-tight group-hover:text-[#34d399] transition-colors">
              AURA-AI
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-data font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 text-[#34d399] border border-emerald-500/30">
              MAINNET 677
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            id="nav-link-flow"
            onClick={() => onScrollTo('flow')}
            className="font-headline font-bold text-xs sm:text-sm text-[#cbd5e1] hover:text-[#34d399] transition-colors cursor-pointer"
          >
            Flow
          </button>
          <button
            id="nav-link-features"
            onClick={() => onScrollTo('features')}
            className="font-headline font-bold text-xs sm:text-sm text-[#cbd5e1] hover:text-[#34d399] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            id="nav-link-live"
            onClick={() => onScrollTo('live')}
            className="font-headline font-bold text-xs sm:text-sm text-[#cbd5e1] hover:text-[#34d399] transition-colors cursor-pointer"
          >
            Live Demo
          </button>
          <button
            id="nav-link-docs"
            onClick={onOpenDocs}
            className="font-headline font-bold text-xs sm:text-sm text-[#34d399] hover:text-[#6ee7b7] transition-colors cursor-pointer"
          >
            Docs
          </button>
        </nav>

        {/* Right: Receipts & Connect Wallet */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Wrong Chain Alert */}
          {isWrongChain && (
            <button
              id="switch-network-warn-btn"
              onClick={switchToBotchain}
              disabled={isSwitchingChain}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] text-[11px] font-bold hover:bg-[#f59e0b]/30 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 animate-pulse" />
              <span className="hidden sm:inline">Switch to BOTChain (677)</span>
              <span className="sm:hidden">Switch (677)</span>
            </button>
          )}

          {/* My Receipts Quick Button */}
          <button
            id="nav-my-receipts-btn"
            onClick={onOpenReceipts}
            className="px-3 py-1.5 rounded-full text-xs font-headline font-bold text-[#34d399] hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">My Receipts</span>
          </button>

          {/* Connect Wallet / Connected State */}
          {!wallet.isConnected ? (
            <button
              id="connect-wallet-btn"
              onClick={() => setIsWalletModalOpen(true)}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 glowing-green-pill text-[#f8fafc] font-headline font-bold text-xs sm:text-sm shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <div className="relative">
              <button
                id="connected-wallet-badge"
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="px-3 py-1.5 rounded-full bg-[#022318]/90 hover:bg-[#043323] border border-emerald-500/40 text-[#f8fafc] font-data text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                <span className="font-semibold">{formatAddress(wallet.address)}</span>
              </button>

              {/* Wallet Dropdown Menu */}
              {showWalletMenu && (
                <div 
                  id="wallet-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#03150d]/95 backdrop-blur-xl p-3 text-left shadow-2xl border border-emerald-500/30 z-50 text-sm animate-fade-in"
                >
                  <div className="p-2 border-b border-emerald-500/20 mb-2">
                    <div className="text-[11px] font-semibold text-emerald-300/60">Connected Wallet</div>
                    <div className="font-data font-semibold text-xs text-[#f8fafc] truncate">
                      {wallet.address}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-emerald-300/60">Network</span>
                      <span className="text-[#34d399] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> BOTChain (677)
                      </span>
                    </div>
                  </div>

                  <a
                    href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${wallet.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-[#cbd5e1] hover:bg-emerald-500/15 hover:text-white transition-colors"
                  >
                    <span>View on BOTChain Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      disconnectWallet();
                      setShowWalletMenu(false);
                    }}
                    className="w-full mt-2 p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 font-bold text-xs text-center border border-red-500/30 transition-all cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
