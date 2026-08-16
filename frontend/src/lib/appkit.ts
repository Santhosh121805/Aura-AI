import { createAppKit } from "@reown/appkit/react";
import type { AppKitNetwork } from "@reown/appkit-common";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { BOTCHAIN_CONFIG } from "./constants";

export const defineChain = <const T extends AppKitNetwork>(chain: T): T => chain;

/** Custom EVM network definition for BOTChain Mainnet. */
export const botchainMainnet = defineChain({
  id: BOTCHAIN_CONFIG.chainId,
  caipNetworkId: `eip155:${BOTCHAIN_CONFIG.chainId}`,
  chainNamespace: "eip155",
  name: BOTCHAIN_CONFIG.name,
  nativeCurrency: {
    name: BOTCHAIN_CONFIG.currency,
    symbol: BOTCHAIN_CONFIG.symbol,
    decimals: BOTCHAIN_CONFIG.decimals,
  },
  rpcUrls: {
    default: { http: [BOTCHAIN_CONFIG.rpcUrl] },
  },
  blockExplorers: {
    default: { name: "BOTChain Explorer", url: BOTCHAIN_CONFIG.explorerUrl },
  },
});

export const projectId = (import.meta.env.VITE_REOWN_PROJECT_ID || "").trim();
export const isAppKitConfigured = Boolean(projectId);

export const appKitMetadata = {
  name: "Aura-AI",
  description: "Explainable on-chain capital decision intelligence",
  url: typeof window !== "undefined" ? window.location.origin : "https://aura-ai.app",
  icons: [],
};

declare global {
  interface Window {
    __AURA_APPKIT_INITIALIZED__?: boolean;
    __AURA_APPKIT_INSTANCE__?: ReturnType<typeof createAppKit>;
  }
}

let appKitInstance: ReturnType<typeof createAppKit> | null = null;

// Synchronous top-level initialization at client module evaluation time — this
// is what prevents "Please call createAppKit before using useAppKit": the
// singleton exists before any component/hook can mount and call useAppKit*.
// Guarded by a window flag so HMR/StrictMode double-invocation never creates
// a second instance.
if (typeof window !== "undefined" && isAppKitConfigured) {
  if (!window.__AURA_APPKIT_INITIALIZED__) {
    try {
      appKitInstance = createAppKit({
        adapters: [new EthersAdapter()],
        networks: [botchainMainnet],
        defaultNetwork: botchainMainnet,
        metadata: appKitMetadata,
        projectId,
        features: {
          analytics: false,
          email: false,
          socials: [],
        },
        themeMode: "dark",
        themeVariables: {
          "--w3m-accent": "#31E6A1",
          "--w3m-border-radius-master": "2px",
        },
      });
      window.__AURA_APPKIT_INITIALIZED__ = true;
      window.__AURA_APPKIT_INSTANCE__ = appKitInstance;
    } catch (err) {
      console.warn("AppKit initialization note:", err);
      appKitInstance = window.__AURA_APPKIT_INSTANCE__ ?? null;
    }
  } else {
    appKitInstance = window.__AURA_APPKIT_INSTANCE__ ?? null;
  }
}

export function getAppKit() {
  if (typeof window === "undefined") return null;
  return window.__AURA_APPKIT_INSTANCE__ ?? appKitInstance;
}
