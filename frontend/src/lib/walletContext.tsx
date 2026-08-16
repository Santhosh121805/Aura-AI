import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserProvider, formatEther, type Eip1193Provider, type Signer } from 'ethers';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from '@reown/appkit/react';
import { getAppKit, botchainMainnet, isAppKitConfigured } from './appkit';
import { BOTCHAIN_CONFIG } from './constants';
import { WalletInfo } from '../types';

const UNCONFIGURED_ERROR =
  'Wallet connection is unavailable: Reown project ID is not configured.';

interface WalletApi {
  wallet: WalletInfo;
  isConnecting: boolean;
  isSwitchingChain: boolean;
  isWrongChain: boolean;
  connectionError: string | null;
  connectWallet: () => void;
  disconnectWallet: () => Promise<void>;
  switchToBotchain: () => Promise<void>;
  formatAddress: (addr?: string | null) => string;
  getSigner: () => Promise<Signer | null>;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
}

function formatAddress(addr?: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function useAppKitWallet(): WalletApi {
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const { chainId, switchNetwork } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>('eip155');

  const [balanceBOT, setBalanceBOT] = useState<string>('0.0000');
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const numericChainId = typeof chainId === 'number' ? chainId : typeof chainId === 'string' ? parseInt(chainId, 10) : null;
  const isWrongChain = Boolean(isConnected && numericChainId && numericChainId !== BOTCHAIN_CONFIG.chainId);
  const isConnecting = status === 'connecting' || status === 'reconnecting';

  useEffect(() => {
    let cancelled = false;
    async function loadBalance() {
      if (!walletProvider || !address) {
        setBalanceBOT('0.0000');
        return;
      }
      try {
        const provider = new BrowserProvider(walletProvider);
        const bal = await provider.getBalance(address);
        if (!cancelled) setBalanceBOT(parseFloat(formatEther(bal)).toFixed(4));
      } catch {
        if (!cancelled) setBalanceBOT('0.0000');
      }
    }
    loadBalance();
    return () => { cancelled = true; };
  }, [walletProvider, address, numericChainId]);

  const connectWallet = useCallback(() => {
    setConnectionError(null);
    open({ view: 'Connect' });
  }, [open]);

  const disconnectWallet = useCallback(async () => {
    try {
      await getAppKit()?.disconnect();
    } catch (err) {
      console.warn('Disconnect note:', err);
    }
  }, []);

  const switchToBotchain = useCallback(async () => {
    setIsSwitchingChain(true);
    setConnectionError(null);
    try {
      await switchNetwork(botchainMainnet);
    } catch (err) {
      console.warn('Network switch failed, opening network picker:', err);
      open({ view: 'Networks' });
    } finally {
      setIsSwitchingChain(false);
    }
  }, [switchNetwork, open]);

  const setIsWalletModalOpen = useCallback((isOpen: boolean) => {
    if (isOpen) open({ view: 'Connect' });
  }, [open]);

  const getSigner = useCallback(async (): Promise<Signer | null> => {
    if (!walletProvider) return null;
    const provider = new BrowserProvider(walletProvider);
    return provider.getSigner();
  }, [walletProvider]);

  return useMemo(() => ({
    wallet: {
      address: address ?? null,
      isConnected: !!isConnected && !!address,
      chainId: numericChainId,
      walletName: isConnected ? 'Wallet' : null,
      balanceBOT,
    },
    isConnecting,
    isSwitchingChain,
    isWrongChain,
    connectionError,
    connectWallet,
    disconnectWallet,
    switchToBotchain,
    formatAddress,
    getSigner,
    isWalletModalOpen: false,
    setIsWalletModalOpen,
  }), [address, isConnected, numericChainId, balanceBOT, isConnecting, isSwitchingChain, isWrongChain, connectionError, connectWallet, disconnectWallet, switchToBotchain, getSigner, setIsWalletModalOpen]);
}

function useDisabledWallet(): WalletApi {
  return useMemo(() => ({
    wallet: { address: null, isConnected: false, chainId: null, walletName: null, balanceBOT: '0.0000' },
    isConnecting: false,
    isSwitchingChain: false,
    isWrongChain: false,
    connectionError: UNCONFIGURED_ERROR,
    connectWallet: () => console.warn(UNCONFIGURED_ERROR),
    disconnectWallet: async () => {},
    switchToBotchain: async () => {},
    formatAddress,
    getSigner: async () => null,
    isWalletModalOpen: false,
    setIsWalletModalOpen: () => {},
  }), []);
}

/**
 * Reown AppKit is a module-level singleton (see ./appkit.ts) rather than
 * React context, so this provider is just a passthrough — kept so existing
 * call sites (`<WalletProvider>` in App.tsx) don't need to change.
 */
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

/**
 * `isAppKitConfigured` is resolved once at module load from a build-time env
 * var and never changes for the lifetime of the app, so this conditional
 * hook selection is stable across all renders (equivalent to picking one of
 * two component trees at build time, not a per-render branch).
 */
export function useWallet(): WalletApi {
  if (!isAppKitConfigured) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useDisabledWallet();
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useAppKitWallet();
}
