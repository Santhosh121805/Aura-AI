import { ethers, Contract, JsonRpcProvider, type Signer } from 'ethers';
import { BOTCHAIN_CONFIG, AURA_REGISTRY_V2_ABI } from './constants';
import { DecisionReceipt, FinalDecision } from '../types';

/**
 * Deterministic decision hash — must byte-for-byte match what
 * AuraStrategyRegistryV2.publishReceipt computes on-chain:
 * keccak256(abi.encodePacked(recommendation, reasoning, confidenceScore, plainEnglishBrief))
 */
export function computeDecisionHash(
  recommendation: string,
  reasoning: string,
  confidenceScore: number,
  plainEnglishBrief: string
): string {
  return ethers.solidityPackedKeccak256(
    ['string', 'string', 'uint8', 'string'],
    [recommendation, reasoning, confidenceScore, plainEnglishBrief]
  );
}

/**
 * Get read-only provider for BOTChain Mainnet
 */
export function getBotchainProvider(): JsonRpcProvider {
  return new JsonRpcProvider(BOTCHAIN_CONFIG.rpcUrl);
}

export interface GasEstimate {
  gasLimit: string;
  gasCostBOT: string;
}

/**
 * Estimate gas cost for publishing a receipt using the connected wallet's own
 * signer (works for both injected and WalletConnect/remote sessions — there
 * is no `window.ethereum` to fall back on for the latter). Returns null (not
 * a fabricated number) when no signer is available.
 */
export async function estimatePublishGas(
  signer: Signer | null | undefined,
  recommendation: string,
  reasoning: string,
  confidenceScore: number,
  plainEnglishBrief: string
): Promise<GasEstimate | null> {
  if (!signer || !signer.provider) return null;
  try {
    const contract = new Contract(BOTCHAIN_CONFIG.contractAddress, AURA_REGISTRY_V2_ABI, signer);

    const estimated: bigint = await contract.publishReceipt.estimateGas(
      recommendation,
      reasoning,
      confidenceScore,
      plainEnglishBrief
    );
    const feeData = await signer.provider.getFeeData();
    const gasPrice = feeData.gasPrice ?? ethers.parseUnits('1', 'gwei');
    const totalCostWei = estimated * gasPrice;
    const gasCostBOT = ethers.formatEther(totalCostWei);

    return {
      gasLimit: estimated.toString(),
      gasCostBOT: parseFloat(gasCostBOT).toFixed(6),
    };
  } catch (err) {
    console.warn('Gas estimation failed:', err);
    return null;
  }
}

/**
 * Publish a decision receipt to the real AuraStrategyRegistryV2 contract on
 * BOTChain Mainnet using the connected wallet's own signer. Never fabricates
 * a transaction hash or block number — if the signer is missing or the
 * transaction fails, this throws.
 */
export async function publishDecisionToContract(
  signer: Signer | null | undefined,
  decision: FinalDecision,
  userAddress: string,
  onSubmitted?: (txHash: string) => void
): Promise<{
  txHash: string;
  decisionHash: string;
  blockNumber: number;
  receipt: DecisionReceipt;
}> {
  if (!signer) {
    throw new Error('No connected wallet signer. Connect a wallet to publish.');
  }

  const contract = new Contract(BOTCHAIN_CONFIG.contractAddress, AURA_REGISTRY_V2_ABI, signer);

  const tx = await contract.publishReceipt(
    decision.recommendation,
    decision.reasoning,
    decision.confidenceScore,
    decision.plainEnglishBrief
  );

  const txHash: string = tx.hash;
  onSubmitted?.(txHash); // Real hash, known the instant the wallet returns it — before mining.
  const txReceipt = await tx.wait(1);
  if (!txReceipt || txReceipt.status !== 1) {
    throw new Error('Transaction reverted on-chain.');
  }

  const decisionHash = computeDecisionHash(
    decision.recommendation,
    decision.reasoning,
    decision.confidenceScore,
    decision.plainEnglishBrief
  );

  const newReceipt: DecisionReceipt = {
    id: `receipt-${txHash}`,
    recommendation: decision.recommendation,
    reasoning: decision.reasoning,
    confidenceScore: decision.confidenceScore,
    plainEnglishBrief: decision.plainEnglishBrief,
    decisionHash,
    publisher: userAddress,
    timestamp: new Date().toISOString(),
    transactionHash: txHash,
    blockNumber: txReceipt.blockNumber,
    outcome: decision.outcome,
  };

  saveReceiptToLocalStorage(newReceipt);

  return {
    txHash,
    decisionHash,
    blockNumber: txReceipt.blockNumber,
    receipt: newReceipt,
  };
}

/**
 * Local cache of this browser's own published receipts (for instant display
 * without waiting on an RPC log query). This is a cache of real transactions
 * this wallet actually sent — never seeded with placeholder data.
 */
const STORAGE_KEY = 'aura_decision_receipts_v2';

export function getStoredReceipts(): DecisionReceipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading stored receipts:', e);
  }
  return [];
}

export function saveReceiptToLocalStorage(receipt: DecisionReceipt) {
  try {
    const existing = getStoredReceipts();
    const updated = [receipt, ...existing.filter(r => r.id !== receipt.id && r.decisionHash !== receipt.decisionHash)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving receipt:', e);
  }
}

/**
 * Verifies a receipt is genuinely on-chain by reading it back from the
 * contract (not just trusting what we cached locally after submission).
 */
export async function verifyReceiptOnChain(
  publisher: string,
  decisionHash: string
): Promise<boolean> {
  try {
    const provider = getBotchainProvider();
    const contract = new Contract(BOTCHAIN_CONFIG.contractAddress, AURA_REGISTRY_V2_ABI, provider);
    return await contract.isPublished(publisher, decisionHash);
  } catch (err) {
    console.warn('On-chain verification failed:', err);
    return false;
  }
}
