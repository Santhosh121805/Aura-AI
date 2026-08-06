// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AuraStrategyRegistry
 * @dev A smart contract to publish AI-generated trading strategies to the BOT Chain Testnet.
 * This proves on-chain interactions and acts as an immutable log of the agent's decisions.
 */
contract AuraStrategyRegistry {
    // Event emitted when a new strategy is published
    event StrategyPublished(
        uint256 indexed timestamp,
        address indexed publisher,
        string recommendation,
        string reasoning,
        uint8 confidenceScore,
        string plainEnglishBrief
    );

    struct Strategy {
        uint256 timestamp;
        address publisher;
        string recommendation;
        string reasoning;
        uint8 confidenceScore;
        string plainEnglishBrief;
    }

    // Mapping of timestamp to Strategy
    mapping(uint256 => Strategy) public strategies;
    
    // Array to keep track of all published strategy timestamps
    uint256[] public strategyTimestamps;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can publish strategies");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Publishes a new strategy to the blockchain.
     * @param recommendation The core recommendation (e.g., "Rotate 25% into ONDO").
     * @param reasoning The reasoning behind the recommendation.
     * @param confidenceScore The confidence score (0-100).
     * @param plainEnglishBrief The Gemini-generated summary.
     */
    function publishStrategy(
        string memory recommendation,
        string memory reasoning,
        uint8 confidenceScore,
        string memory plainEnglishBrief
    ) external onlyOwner {
        uint256 currentTime = block.timestamp;

        Strategy memory newStrategy = Strategy({
            timestamp: currentTime,
            publisher: msg.sender,
            recommendation: recommendation,
            reasoning: reasoning,
            confidenceScore: confidenceScore,
            plainEnglishBrief: plainEnglishBrief
        });

        strategies[currentTime] = newStrategy;
        strategyTimestamps.push(currentTime);

        emit StrategyPublished(
            currentTime,
            msg.sender,
            recommendation,
            reasoning,
            confidenceScore,
            plainEnglishBrief
        );
    }

    /**
     * @dev Retrieves the total number of strategies published.
     */
    function getStrategyCount() external view returns (uint256) {
        return strategyTimestamps.length;
    }
}
