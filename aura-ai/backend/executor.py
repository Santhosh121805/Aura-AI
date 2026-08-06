"""Executor for publishing Aura strategies to BOT Chain Testnet."""

import json
import os
from typing import Any, Dict

from web3 import Web3
from web3.exceptions import ContractLogicError

# ABI for the AuraStrategyRegistry smart contract
REGISTRY_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "recommendation", "type": "string"},
            {"internalType": "string", "name": "reasoning", "type": "string"},
            {"internalType": "uint8", "name": "confidenceScore", "type": "uint8"},
            {"internalType": "string", "name": "plainEnglishBrief", "type": "string"}
        ],
        "name": "publishStrategy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

def execute_strategy_on_chain(strategy_spec: Dict[str, Any], brief: str) -> str:
    """
    Submits the strategy spec to the BOT Chain Testnet smart contract.
    Returns the transaction hash if successful, or an error string if not.
    """
    rpc_url = os.getenv("BOT_CHAIN_RPC_URL")
    private_key = os.getenv("WALLET_PRIVATE_KEY")
    contract_address = os.getenv("REGISTRY_CONTRACT_ADDRESS")
    
    if not rpc_url or not private_key or not contract_address:
        print("Skipping on-chain execution: Missing BOT Chain environment variables.")
        return "Setup incomplete: Missing env vars"
        
    try:
        w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not w3.is_connected():
            return "Failed to connect to BOT Chain RPC"
            
        account = w3.eth.account.from_key(private_key)
        contract = w3.eth.contract(address=contract_address, abi=REGISTRY_ABI)
        
        # Prepare data for contract
        recommendation = str(strategy_spec.get("recommendation", "None"))
        reasoning = str(strategy_spec.get("reasoning", "None"))
        confidence_score = int(strategy_spec.get("confidence_score", 0))
        
        # Build transaction
        nonce = w3.eth.get_transaction_count(account.address)
        
        tx = contract.functions.publishStrategy(
            recommendation,
            reasoning,
            confidence_score,
            brief
        ).build_transaction({
            "chainId": int(os.getenv("BOT_CHAIN_CHAIN_ID", "677")),
            "gas": 300000,
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
        })
        
        # Sign and send
        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # We don't block and wait for receipt to keep the stream fast
        # tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return w3.to_hex(tx_hash)
    except Exception as exc:
        print(f"Error publishing strategy on-chain: {exc}")
        return f"Error: {exc}"
