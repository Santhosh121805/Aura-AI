import React, { useState } from 'react';
import { useWallet } from '../lib/walletContext';
import { 
  X, 
  Wallet, 
  ShieldCheck, 
  QrCode, 
  Search, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export const WalletModal: React.FC = () => {
  const { isWalletModalOpen, setIsWalletModalOpen, connectWallet, isConnecting } = useWallet();
  const [showQR, setShowQR] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isWalletModalOpen) return null;

  const hasInjected = typeof window !== 'undefined' && Boolean(window.ethereum);

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      isInstalled: hasInjected,
      badge: hasInjected ? 'Installed' : 'Popular',
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      isInstalled: false,
      badge: 'Multi-Chain',
    },
    {
      id: 'rabby',
      name: 'Rabby Wallet',
      icon: '🐰',
      isInstalled: false,
      badge: 'DeFi Pro',
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      isInstalled: false,
      badge: 'Smart Wallet',
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      isInstalled: false,
      badge: 'Mobile & Ext',
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      isInstalled: true,
      badge: '70+ Wallets',
      isQR: true,
    },
  ];

  const filteredWallets = wallets.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectWallet = async (w: typeof wallets[0]) => {
    if (w.isQR) {
      setShowQR(true);
      return;
    }
    await connectWallet(w.name);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#010b06]/85 backdrop-blur-xl animate-fade-in">
      <div 
        id="reown-wallet-modal"
        className="w-full max-w-md rounded-3xl bg-[#03150d]/95 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.3)] p-6 sm:p-7 text-[#f8fafc] relative"
      >
        {/* Header & Close */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-[#34d399] border border-emerald-500/30">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="font-headline font-extrabold text-lg sm:text-xl text-[#f8fafc]">
              Connect Wallet
            </h3>
          </div>

          <button
            onClick={() => {
              setIsWalletModalOpen(false);
              setShowQR(false);
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#f8fafc] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code view */}
        {showQR ? (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="w-48 h-48 bg-[#021810] p-3 rounded-2xl shadow-inner mb-4 flex items-center justify-center border-4 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              {/* High quality visual QR code simulation */}
              <div className="w-full h-full bg-emerald-950/40 rounded-xl p-2 flex flex-col justify-between items-center text-[#34d399]">
                <QrCode className="w-32 h-32 text-emerald-200 animate-pulse" />
                <span className="text-[9px] font-data text-[#34d399]">wc:aura-botchain-677@2</span>
              </div>
            </div>

            <p className="font-body text-xs font-semibold text-emerald-200/80 mb-2">
              Scan with your mobile wallet camera or WalletConnect app
            </p>

            <div className="flex gap-2 w-full mt-2">
              <button
                onClick={() => setShowQR(false)}
                className="w-1/2 py-2.5 rounded-full border border-emerald-500/30 text-xs font-bold hover:bg-white/10 text-white cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => connectWallet('WalletConnect (Mobile)')}
                className="w-1/2 py-2.5 rounded-full glowing-green-pill text-xs font-bold text-white cursor-pointer"
              >
                Simulate Connect
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 70+ Web3 wallets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#021810]/80 border border-emerald-500/30 text-xs font-body font-semibold text-[#f8fafc] placeholder-emerald-400/60 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Wallets List */}
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
              {filteredWallets.map((w) => (
                <button
                  key={w.id}
                  id={`select-wallet-${w.id}`}
                  onClick={() => handleSelectWallet(w)}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/60 transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{w.icon}</span>
                    <div>
                      <div className="font-headline font-bold text-sm text-[#f8fafc] group-hover:text-[#34d399] transition-colors">
                        {w.name}
                      </div>
                      <div className="font-body text-[11px] text-emerald-300/60">
                        {w.isInstalled ? 'Ready in browser' : 'Connect securely'}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-data bg-emerald-500/20 text-[#34d399] border border-emerald-500/40">
                    {w.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Demo Treasury Wallet Button */}
            <button
              onClick={() => connectWallet('Demo Treasury Wallet')}
              className="w-full py-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 hover:border-emerald-400 text-[#f8fafc] text-xs font-headline font-bold flex items-center justify-center gap-2 transition-all cursor-pointer mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Connect Instant Demo Treasury Key</span>
            </button>

            {/* Safety Guarantee */}
            <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-300/70">
              <Lock className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Zero Custody: Never requests seed phrases or asset moves</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
