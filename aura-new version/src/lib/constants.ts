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
  chainId: 677,
  chainIdHex: '0x2A5',
  name: 'BOTChain Mainnet',
  currency: 'BOT',
  symbol: 'BOT',
  decimals: 18,
  rpcUrl: 'https://rpc.botchain.ai',
  explorerUrl: 'https://scan.botchain.ai',
  contractAddress: '0x66266ec8FCE6190D507114C9EE91262eC887a9C4',
  version: 'V2 Production',
} as const;

export const AURA_REGISTRY_V2_ABI = [
  // Read Methods
  "function owner() view returns (address)",
  "function totalReceipts() view returns (uint256)",
  "function getReceipt(bytes32 decisionHash) view returns (address publisher, string recommendation, string reasoning, uint8 confidenceScore, string plainEnglishBrief, uint256 timestamp)",
  "function hasPublished(address publisher, bytes32 decisionHash) view returns (bool)",

  // Write Methods
  "function publishReceipt(string recommendation, string reasoning, uint8 confidenceScore, string plainEnglishBrief) returns (bytes32)",

  // Events
  "event DecisionReceiptPublished(address indexed publisher, string recommendation, uint8 confidenceScore, bytes32 decisionHash, uint256 timestamp)"
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

export const HISTORICAL_RECEIPTS_SEED = [
  {
    id: 'receipt-seed-1',
    recommendation: 'Rotate 20% into ONDO',
    reasoning: 'Institutional RWA inflows on BNB Chain and Ethereum rose $82M this week. Narrative sentiment is overwhelmingly positive. Capital flow agents confirm sustained institutional accumulation above the $0.72 support zone with minimal slippage.',
    confidenceScore: 84,
    plainEnglishBrief: 'High-conviction RWA rotation backed by institutional on-chain inflow velocity and robust macro tailwinds.',
    decisionHash: '0x8f3c1a9e22b04f7623910db0e87b7a641772183e9bca9283f1e9488a0b329481',
    publisher: '0x71C...38A4',
    timestamp: '2026-08-14T19:42:10Z',
    transactionHash: '0xc2a62ed6d587a4ed53705c2116778c226a661730774d52f823fdfae050f8be85',
    blockNumber: 4892104,
    outcome: 'STRATEGY_READY' as const,
  },
  {
    id: 'receipt-seed-2',
    recommendation: 'Maintain USDC / BOT Collateral Buffer (Watch)',
    reasoning: 'Macro agent flagged rising treasury yields and impending CPI volatility index spike. While AI-token narrative shows localized spikes, risk agent detected sudden DEX liquidity depletion on secondary pairs.',
    confidenceScore: 62,
    plainEnglishBrief: 'Diverging signals between AI narrative and macro liquidity warrant holding dry powder until post-announcement volatility settles.',
    decisionHash: '0x4e1b72a089d71c4f5298811e740acba3619556218d6e9f1402377a0bc0839e55',
    publisher: '0x94B...F120',
    timestamp: '2026-08-13T11:15:33Z',
    transactionHash: '0x17b38df9a202c4f8281987dbe63a9219b582046fa44b3017a0df472910fa4822',
    blockNumber: 4887302,
    outcome: 'WATCH' as const,
  },
  {
    id: 'receipt-seed-3',
    recommendation: 'No Trade — Capital Preservation Mode',
    reasoning: 'Consensus engine reached 5/6 Bearish / High Risk threshold. Extreme funding rate distortion on perps coupled with $140M net exchange inflows signaling heavy distribution pressure across DeFi majors.',
    confidenceScore: 31,
    plainEnglishBrief: 'Unanimous risk defense: treasury remains 100% stable collateralized with zero speculative exposure.',
    decisionHash: '0x992cf081b2a47298a00bc91845dfaa62400192eab6198f498c8192a0df816b39',
    publisher: '0x71C...38A4',
    timestamp: '2026-08-11T08:30:19Z',
    transactionHash: '0x8892ca847294857b283948eab01239841029cba84729841920acbadf92847192',
    blockNumber: 4875019,
    outcome: 'NO_TRADE' as const,
  }
];
