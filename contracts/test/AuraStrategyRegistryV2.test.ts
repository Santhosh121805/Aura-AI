import { expect } from "chai";
import { ethers } from "hardhat";
import type { AuraStrategyRegistryV2 } from "../typechain-types";

describe("AuraStrategyRegistryV2", () => {
  async function deploy() {
    const [walletA, walletB, walletC] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("AuraStrategyRegistryV2");
    const registry = (await Factory.deploy()) as unknown as AuraStrategyRegistryV2;
    await registry.waitForDeployment();
    return { registry, walletA, walletB, walletC };
  }

  const sampleReceipt = {
    recommendation: "Rotate 25% into ONDO",
    reasoning: "RWA momentum confirmed by institutional inflows",
    confidenceScore: 82,
    plainEnglishBrief: "RWA sector is heating up; recommend rotation.",
  };

  function expectedHash(r: typeof sampleReceipt) {
    return ethers.solidityPackedKeccak256(
      ["string", "string", "uint8", "string"],
      [r.recommendation, r.reasoning, r.confidenceScore, r.plainEnglishBrief]
    );
  }

  it("allows any connected wallet to publish (no owner restriction)", async () => {
    const { registry, walletA } = await deploy();
    await expect(
      registry
        .connect(walletA)
        .publishReceipt(
          sampleReceipt.recommendation,
          sampleReceipt.reasoning,
          sampleReceipt.confidenceScore,
          sampleReceipt.plainEnglishBrief
        )
    ).to.emit(registry, "DecisionReceiptPublished");
  });

  it("records msg.sender as the publisher and stores all receipt fields", async () => {
    const { registry, walletA } = await deploy();
    const tx = await registry
      .connect(walletA)
      .publishReceipt(
        sampleReceipt.recommendation,
        sampleReceipt.reasoning,
        sampleReceipt.confidenceScore,
        sampleReceipt.plainEnglishBrief
      );
    await tx.wait();

    const decisionHash = expectedHash(sampleReceipt);
    const receipt = await registry.getReceiptByPublisherAndHash(walletA.address, decisionHash);

    expect(receipt.publisher).to.equal(walletA.address);
    expect(receipt.recommendation).to.equal(sampleReceipt.recommendation);
    expect(receipt.reasoning).to.equal(sampleReceipt.reasoning);
    expect(receipt.confidenceScore).to.equal(sampleReceipt.confidenceScore);
    expect(receipt.plainEnglishBrief).to.equal(sampleReceipt.plainEnglishBrief);
    expect(receipt.decisionHash).to.equal(decisionHash);
    expect(receipt.timestamp).to.be.greaterThan(0);
  });

  it("lets two independent wallets each publish their own receipt for the same content", async () => {
    const { registry, walletA, walletB } = await deploy();

    await (
      await registry
        .connect(walletA)
        .publishReceipt(
          sampleReceipt.recommendation,
          sampleReceipt.reasoning,
          sampleReceipt.confidenceScore,
          sampleReceipt.plainEnglishBrief
        )
    ).wait();

    await (
      await registry
        .connect(walletB)
        .publishReceipt(
          sampleReceipt.recommendation,
          sampleReceipt.reasoning,
          sampleReceipt.confidenceScore,
          sampleReceipt.plainEnglishBrief
        )
    ).wait();

    const decisionHash = expectedHash(sampleReceipt);
    expect(await registry.isPublished(walletA.address, decisionHash)).to.equal(true);
    expect(await registry.isPublished(walletB.address, decisionHash)).to.equal(true);

    const receiptA = await registry.getReceiptByPublisherAndHash(walletA.address, decisionHash);
    const receiptB = await registry.getReceiptByPublisherAndHash(walletB.address, decisionHash);
    expect(receiptA.publisher).to.equal(walletA.address);
    expect(receiptB.publisher).to.equal(walletB.address);
    expect(await registry.getReceiptCount()).to.equal(2n);
  });

  it("rejects the same wallet publishing the identical decision hash twice", async () => {
    const { registry, walletA } = await deploy();

    await (
      await registry
        .connect(walletA)
        .publishReceipt(
          sampleReceipt.recommendation,
          sampleReceipt.reasoning,
          sampleReceipt.confidenceScore,
          sampleReceipt.plainEnglishBrief
        )
    ).wait();

    await expect(
      registry
        .connect(walletA)
        .publishReceipt(
          sampleReceipt.recommendation,
          sampleReceipt.reasoning,
          sampleReceipt.confidenceScore,
          sampleReceipt.plainEnglishBrief
        )
    ).to.be.revertedWithCustomError(registry, "DuplicateReceipt");
  });

  it("allows the same wallet to publish again once any field changes (different hash)", async () => {
    const { registry, walletA } = await deploy();

    await (
      await registry
        .connect(walletA)
        .publishReceipt(
          sampleReceipt.recommendation,
          sampleReceipt.reasoning,
          sampleReceipt.confidenceScore,
          sampleReceipt.plainEnglishBrief
        )
    ).wait();

    await expect(
      registry
        .connect(walletA)
        .publishReceipt(
          sampleReceipt.recommendation,
          sampleReceipt.reasoning,
          sampleReceipt.confidenceScore + 1,
          sampleReceipt.plainEnglishBrief
        )
    ).to.emit(registry, "DecisionReceiptPublished");
  });

  it("rejects a confidence score above 100", async () => {
    const { registry, walletA } = await deploy();
    await expect(
      registry
        .connect(walletA)
        .publishReceipt(
          sampleReceipt.recommendation,
          sampleReceipt.reasoning,
          101,
          sampleReceipt.plainEnglishBrief
        )
    ).to.be.revertedWithCustomError(registry, "InvalidConfidenceScore");
  });

  it("accepts boundary confidence scores of 0 and 100", async () => {
    const { registry, walletA, walletB } = await deploy();
    await expect(
      registry.connect(walletA).publishReceipt("rec", "reason", 0, "brief")
    ).to.emit(registry, "DecisionReceiptPublished");
    await expect(
      registry.connect(walletB).publishReceipt("rec", "reason", 100, "brief")
    ).to.emit(registry, "DecisionReceiptPublished");
  });

  it("computes the same decision hash on-chain as the off-chain helper", async () => {
    const { registry } = await deploy();
    const onChainHash = await registry.computeDecisionHash(
      sampleReceipt.recommendation,
      sampleReceipt.reasoning,
      sampleReceipt.confidenceScore,
      sampleReceipt.plainEnglishBrief
    );
    expect(onChainHash).to.equal(expectedHash(sampleReceipt));
  });

  it("reverts when reading a receipt that was never published", async () => {
    const { registry, walletC } = await deploy();
    const decisionHash = expectedHash(sampleReceipt);
    await expect(
      registry.getReceiptByPublisherAndHash(walletC.address, decisionHash)
    ).to.be.revertedWithCustomError(registry, "ReceiptNotFound");
  });

  // ── Outcome-specific tests ──────────────────────────────────────────────────

  const watchReceipt = {
    recommendation: "",
    reasoning: "Market signals mixed; monitoring for cleaner alignment.",
    confidenceScore: 40,
    plainEnglishBrief: "Signal agreement below threshold. Watch for rotation.",
  };

  const noTradeReceipt = {
    recommendation: "",
    reasoning: "",
    confidenceScore: 15,
    plainEnglishBrief: "Signal agreement below threshold. Wait for cleaner alignment before rotating capital.",
  };

  it("publishes a Watch decision receipt (empty recommendation)", async () => {
    const { registry, walletA } = await deploy();
    const tx = await registry
      .connect(walletA)
      .publishReceipt(
        watchReceipt.recommendation,
        watchReceipt.reasoning,
        watchReceipt.confidenceScore,
        watchReceipt.plainEnglishBrief
      );
    await tx.wait();

    const decisionHash = expectedHash(watchReceipt);
    const receipt = await registry.getReceiptByPublisherAndHash(walletA.address, decisionHash);
    expect(receipt.publisher).to.equal(walletA.address);
    expect(receipt.recommendation).to.equal("");
    expect(receipt.reasoning).to.equal(watchReceipt.reasoning);
    expect(receipt.confidenceScore).to.equal(watchReceipt.confidenceScore);
  });

  it("publishes a No Trade decision receipt (empty recommendation + reasoning)", async () => {
    const { registry, walletA } = await deploy();
    const tx = await registry
      .connect(walletA)
      .publishReceipt(
        noTradeReceipt.recommendation,
        noTradeReceipt.reasoning,
        noTradeReceipt.confidenceScore,
        noTradeReceipt.plainEnglishBrief
      );
    await tx.wait();

    const decisionHash = expectedHash(noTradeReceipt);
    const receipt = await registry.getReceiptByPublisherAndHash(walletA.address, decisionHash);
    expect(receipt.publisher).to.equal(walletA.address);
    expect(receipt.recommendation).to.equal("");
    expect(receipt.reasoning).to.equal("");
    expect(receipt.confidenceScore).to.equal(noTradeReceipt.confidenceScore);
  });

  it("publishes all three outcome types from the same wallet with distinct hashes", async () => {
    const { registry, walletA } = await deploy();

    // trade_signal
    await (await registry.connect(walletA).publishReceipt(
      sampleReceipt.recommendation, sampleReceipt.reasoning,
      sampleReceipt.confidenceScore, sampleReceipt.plainEnglishBrief
    )).wait();

    // watch
    await (await registry.connect(walletA).publishReceipt(
      watchReceipt.recommendation, watchReceipt.reasoning,
      watchReceipt.confidenceScore, watchReceipt.plainEnglishBrief
    )).wait();

    // no_trade
    await (await registry.connect(walletA).publishReceipt(
      noTradeReceipt.recommendation, noTradeReceipt.reasoning,
      noTradeReceipt.confidenceScore, noTradeReceipt.plainEnglishBrief
    )).wait();

    expect(await registry.getReceiptCount()).to.equal(3n);

    const hashTrade = expectedHash(sampleReceipt);
    const hashWatch = expectedHash(watchReceipt);
    const hashNoTrade = expectedHash(noTradeReceipt);

    // All three hashes are distinct
    expect(hashTrade).to.not.equal(hashWatch);
    expect(hashTrade).to.not.equal(hashNoTrade);
    expect(hashWatch).to.not.equal(hashNoTrade);

    // All three are individually retrievable
    expect(await registry.isPublished(walletA.address, hashTrade)).to.equal(true);
    expect(await registry.isPublished(walletA.address, hashWatch)).to.equal(true);
    expect(await registry.isPublished(walletA.address, hashNoTrade)).to.equal(true);
  });

  it("prevents duplicate Watch receipt from the same wallet", async () => {
    const { registry, walletA } = await deploy();

    await (await registry.connect(walletA).publishReceipt(
      watchReceipt.recommendation, watchReceipt.reasoning,
      watchReceipt.confidenceScore, watchReceipt.plainEnglishBrief
    )).wait();

    await expect(
      registry.connect(walletA).publishReceipt(
        watchReceipt.recommendation, watchReceipt.reasoning,
        watchReceipt.confidenceScore, watchReceipt.plainEnglishBrief
      )
    ).to.be.revertedWithCustomError(registry, "DuplicateReceipt");
  });
});
