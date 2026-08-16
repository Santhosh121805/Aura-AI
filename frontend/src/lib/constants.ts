import { AgentStatusState } from '../types';

export const VIDEO_CONFIG = {
  url: "https://res.cloudinary.com/dzucladtl/video/upload/v1786856676/WhatsApp_Video_2026-08-16_at_10.32.45_AM_reremi.mp4",
  poster: "https://res.cloudinary.com/dzucladtl/video/upload/v1786856676/WhatsApp_Video_2026-08-16_at_10.32.45_AM_reremi.jpg",
  autoplay: true,
  muted: true,
  loop: true,
  playsInline: true,
  controls: false,
  preload: "auto"
} as const;

export const BOTCHAIN_CONFIG = {
  chainId: Number(import.meta.env.VITE_BOTCHAIN_CHAIN_ID || 677),
  chainIdHex: '0x2A5',
  name: 'BOTChain Mainnet',
  currency: 'BOT',
  symbol: 'BOT',
  decimals: 18,
  rpcUrl: import.meta.env.VITE_BOTCHAIN_RPC_URL || 'https://rpc.botchain.ai',
  explorerUrl: import.meta.env.VITE_BOTCHAIN_EXPLORER_URL || 'https://scan.botchain.ai',
  // Verified on-chain: deployed bytecode at this address is byte-identical to
  // contracts/contracts/AuraStrategyRegistryV2.sol.
  contractAddress: import.meta.env.VITE_REGISTRY_CONTRACT_ADDRESS || '0x66266ec8FCE6190D507114C9EE91262eC887a9C4',
  version: 'V2 Production',
} as const;

export const AURA_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002';

// Matches AuraStrategyRegistryV2.sol exactly (contracts/contracts/AuraStrategyRegistryV2.sol).
export const AURA_REGISTRY_V2_ABI = [
  // Read Methods
  "function getReceipt(bytes32 receiptId) view returns (tuple(address publisher, uint256 timestamp, string recommendation, string reasoning, uint8 confidenceScore, string plainEnglishBrief, bytes32 decisionHash))",
  "function getReceiptByPublisherAndHash(address publisher, bytes32 decisionHash) view returns (tuple(address publisher, uint256 timestamp, string recommendation, string reasoning, uint8 confidenceScore, string plainEnglishBrief, bytes32 decisionHash))",
  "function getReceiptCount() view returns (uint256)",
  "function getReceiptIdAt(uint256 index) view returns (bytes32)",
  "function isPublished(address publisher, bytes32 decisionHash) view returns (bool)",
  "function computeDecisionHash(string recommendation, string reasoning, uint8 confidenceScore, string plainEnglishBrief) pure returns (bytes32)",
  "function hasPublished(address, bytes32) view returns (bool)",

  // Write Methods
  "function publishReceipt(string recommendation, string reasoning, uint8 confidenceScore, string plainEnglishBrief) returns (bytes32 receiptId, bytes32 decisionHash)",

  // Events
  "event DecisionReceiptPublished(bytes32 indexed receiptId, bytes32 indexed decisionHash, address indexed publisher, uint256 timestamp, uint8 confidenceScore)"
];

export const INITIAL_AGENTS: AgentStatusState[] = [
  {
    id: 'narrative',
    name: 'Narrative Agent',
    role: 'Reads the market story & thematic shifts',
    icon: 'Sparkles',
    status: 'idle',
    streamedText: '',
  },
  {
    id: 'sentiment',
    name: 'Sentiment Agent',
    role: 'Measures crowd psychology, fear & greed',
    icon: 'Activity',
    status: 'idle',
    streamedText: '',
  },
  {
    id: 'capitalFlow',
    name: 'Capital Flow Agent',
    role: 'Tracks institutional liquidity & whale flows',
    icon: 'TrendingUp',
    status: 'idle',
    streamedText: '',
  },
  {
    id: 'macro',
    name: 'Macro Agent',
    role: 'Evaluates global liquidity, rates & regimes',
    icon: 'Globe',
    status: 'idle',
    streamedText: '',
  },
  {
    id: 'risk',
    name: 'Risk Agent',
    role: 'Identifies protocol hazards, slippage & drawdown',
    icon: 'ShieldAlert',
    status: 'idle',
    streamedText: '',
  },
  {
    id: 'strategy',
    name: 'Strategy Agent',
    role: 'Synthesizes all signals into actionable consensus',
    icon: 'Zap',
    status: 'idle',
    streamedText: '',
  },
];

// No seeded/fake receipts: this list starts empty. Real receipts come only from
// this wallet's own genuine publishReceipt() transactions (see contract.ts).
