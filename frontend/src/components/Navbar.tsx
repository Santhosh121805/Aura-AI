import React, { useState } from 'react';
import { useWallet } from '../lib/walletContext';
import { BOTCHAIN_CONFIG } from '../lib/constants';
import { Menu, X, ExternalLink, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  onOpenReceipts: () => void;
  onOpenDocs: () => void;
  onScrollTo: (sectionId: string) => void;
}

const LINKS = [
  { id: 'features', label: 'Product' },
  { id: 'flow', label: 'How it works' },
  { id: 'live', label: 'Live analysis' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenReceipts, onOpenDocs, onScrollTo }) => {
  const { wallet, isWrongChain, isSwitchingChain, isConnecting, switchToBotchain, formatAddress, connectWallet, disconnectWallet } = useWallet();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: string) => {
    onScrollTo(id);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 h-14 px-4 sm:px-5 rounded-full bg-[#0B0D0C]/85 backdrop-blur-xl border border-[#F3F1EA]/10">
        {/* Left: wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 shrink-0"
          aria-label="Aura-AI home"
        >
          <span className="w-6 h-6 rounded-full bg-[#31E6A1] flex items-center justify-center text-[#0B0D0C] font-bold text-xs">A</span>
          <span className="font-semibold text-sm tracking-tight text-[#F3F1EA]">Aura-AI</span>
        </button>

        {/* Center: nav links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className="text-sm text-[#F3F1EA]/70 hover:text-[#F3F1EA] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button onClick={onOpenReceipts} className="text-sm text-[#F3F1EA]/70 hover:text-[#F3F1EA] transition-colors">
            Receipts
          </button>
          <button onClick={onOpenDocs} className="text-sm text-[#F3F1EA]/70 hover:text-[#F3F1EA] transition-colors">
            Docs
          </button>
        </nav>

        {/* Right: wallet */}
        <div className="flex items-center gap-2">
          {isWrongChain && (
            <button
              onClick={switchToBotchain}
              disabled={isSwitchingChain}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e2a33d]/15 text-[#e2a33d] text-xs font-semibold hover:bg-[#e2a33d]/25 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Switch network</span>
            </button>
          )}

          {!wallet.isConnected ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-4 py-2 rounded-full bg-[#31E6A1] text-[#0B0D0C] text-sm font-semibold hover:bg-[#31E6A1]/90 transition-colors disabled:opacity-50"
            >
              {isConnecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowWalletMenu((v) => !v)}
                className="px-3 py-2 rounded-full border border-[#F3F1EA]/15 text-[#F3F1EA] text-xs font-data hover:border-[#F3F1EA]/30 transition-colors"
                aria-haspopup="menu"
                aria-expanded={showWalletMenu}
              >
                {formatAddress(wallet.address)}
              </button>
              {showWalletMenu && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#141715] border border-[#F3F1EA]/10 p-2 text-sm shadow-xl"
                >
                  <a
                    href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${wallet.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-[#F3F1EA]/80 hover:bg-[#F3F1EA]/5 hover:text-[#F3F1EA] transition-colors"
                  >
                    View on explorer <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                  <button
                    onClick={() => { disconnectWallet(); setShowWalletMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-[#e2543d] hover:bg-[#e2543d]/10 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden p-2 text-[#F3F1EA]/80"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 rounded-2xl bg-[#0B0D0C]/95 backdrop-blur-xl border border-[#F3F1EA]/10 p-3 flex flex-col gap-1">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className="text-left px-3 py-2.5 rounded-xl text-[#F3F1EA]/80 hover:bg-[#F3F1EA]/5 hover:text-[#F3F1EA] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button onClick={() => { onOpenReceipts(); setMobileOpen(false); }} className="text-left px-3 py-2.5 rounded-xl text-[#F3F1EA]/80 hover:bg-[#F3F1EA]/5 hover:text-[#F3F1EA] transition-colors">
            Receipts
          </button>
          <button onClick={() => { onOpenDocs(); setMobileOpen(false); }} className="text-left px-3 py-2.5 rounded-xl text-[#F3F1EA]/80 hover:bg-[#F3F1EA]/5 hover:text-[#F3F1EA] transition-colors">
            Docs
          </button>
        </div>
      )}
    </header>
  );
};
