"""Deterministic decision-hash helper shared between the API response and
the AuraStrategyRegistryV2 contract.

The contract computes `keccak256(abi.encodePacked(recommendation, reasoning,
confidenceScore, plainEnglishBrief))` on-chain when a receipt is published.
This mirrors that exact encoding so the hash shown to the user before they
sign matches what the contract will derive itself.
"""

from __future__ import annotations

from web3 import Web3


def compute_decision_hash(
    recommendation: str,
    reasoning: str,
    confidence_score: int,
    plain_english_brief: str,
) -> str:
    """Returns the 0x-prefixed keccak256 hash matching AuraStrategyRegistryV2.computeDecisionHash."""
    digest = Web3.solidity_keccak(
        ["string", "string", "uint8", "string"],
        [recommendation, reasoning, int(confidence_score), plain_english_brief],
    )
    return "0x" + digest.hex()
