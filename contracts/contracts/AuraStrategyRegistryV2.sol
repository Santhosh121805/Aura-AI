// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AuraStrategyRegistryV2
 * @dev Permissionless registry for AURA AI Decision Receipts on BOTChain.
 *
 * Unlike V1 (onlyOwner), any connected wallet may publish its own receipt.
 * The decision hash is computed on-chain from the receipt content so a
 * caller cannot associate an arbitrary hash with unrelated data, and the
 * same wallet cannot publish the same content twice.
 */
contract AuraStrategyRegistryV2 {
    struct Receipt {
        address publisher;
        uint256 timestamp;
        string recommendation;
        string reasoning;
        uint8 confidenceScore;
        string plainEnglishBrief;
        bytes32 decisionHash;
    }

    error InvalidConfidenceScore(uint8 provided);
    error DuplicateReceipt(address publisher, bytes32 decisionHash);
    error ReceiptNotFound(bytes32 receiptId);

    event DecisionReceiptPublished(
        bytes32 indexed receiptId,
        bytes32 indexed decisionHash,
        address indexed publisher,
        uint256 timestamp,
        uint8 confidenceScore
    );

    mapping(bytes32 => Receipt) private _receipts;
    mapping(bytes32 => bool) private _receiptExists;
    mapping(address => mapping(bytes32 => bool)) public hasPublished;
    bytes32[] private _receiptIds;

    /**
     * @dev Publishes a Decision Receipt under the caller's own wallet.
     * The decision hash is derived from the content, not supplied by the
     * caller, so it always matches what is stored.
     */
    function publishReceipt(
        string calldata recommendation,
        string calldata reasoning,
        uint8 confidenceScore,
        string calldata plainEnglishBrief
    ) external returns (bytes32 receiptId, bytes32 decisionHash) {
        if (confidenceScore > 100) revert InvalidConfidenceScore(confidenceScore);

        decisionHash = keccak256(
            abi.encodePacked(recommendation, reasoning, confidenceScore, plainEnglishBrief)
        );

        if (hasPublished[msg.sender][decisionHash]) {
            revert DuplicateReceipt(msg.sender, decisionHash);
        }
        hasPublished[msg.sender][decisionHash] = true;

        receiptId = keccak256(abi.encodePacked(msg.sender, decisionHash));
        uint256 ts = block.timestamp;

        _receipts[receiptId] = Receipt({
            publisher: msg.sender,
            timestamp: ts,
            recommendation: recommendation,
            reasoning: reasoning,
            confidenceScore: confidenceScore,
            plainEnglishBrief: plainEnglishBrief,
            decisionHash: decisionHash
        });
        _receiptExists[receiptId] = true;
        _receiptIds.push(receiptId);

        emit DecisionReceiptPublished(receiptId, decisionHash, msg.sender, ts, confidenceScore);
    }

    /// @dev Returns a stored receipt by its id (keccak256(publisher, decisionHash)).
    function getReceipt(bytes32 receiptId) external view returns (Receipt memory) {
        if (!_receiptExists[receiptId]) revert ReceiptNotFound(receiptId);
        return _receipts[receiptId];
    }

    /// @dev Convenience lookup: derives the receipt id for a (publisher, decisionHash) pair.
    function getReceiptByPublisherAndHash(
        address publisher,
        bytes32 decisionHash
    ) external view returns (Receipt memory) {
        bytes32 receiptId = keccak256(abi.encodePacked(publisher, decisionHash));
        if (!_receiptExists[receiptId]) revert ReceiptNotFound(receiptId);
        return _receipts[receiptId];
    }

    function getReceiptCount() external view returns (uint256) {
        return _receiptIds.length;
    }

    function getReceiptIdAt(uint256 index) external view returns (bytes32) {
        return _receiptIds[index];
    }

    function isPublished(address publisher, bytes32 decisionHash) external view returns (bool) {
        return hasPublished[publisher][decisionHash];
    }

    /// @dev Recomputes the deterministic decision hash for given content, for
    /// off-chain callers (frontend/backend) to verify they match on-chain logic.
    function computeDecisionHash(
        string calldata recommendation,
        string calldata reasoning,
        uint8 confidenceScore,
        string calldata plainEnglishBrief
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(recommendation, reasoning, confidenceScore, plainEnglishBrief));
    }
}
