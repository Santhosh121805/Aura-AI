"""Tests for the decision-hash helper shared with AuraStrategyRegistryV2."""

import os

from backend.decision_hash import compute_decision_hash


def test_decision_hash_matches_known_vector():
    """Cross-checked against ethers.solidityPackedKeccak256 with identical inputs."""
    result = compute_decision_hash(
        recommendation="Rotate 25% into ONDO",
        reasoning="RWA momentum confirmed by institutional inflows",
        confidence_score=82,
        plain_english_brief="RWA sector is heating up; recommend rotation.",
    )
    assert result == "0x0fc86a7cedb83871de3955adf3ce0b99dbf3d61e54c2779b3c0a201e44b80cd3"


def test_decision_hash_is_deterministic():
    args = ("BUY ETH", "Good flow", 85, "This is a test.")
    assert compute_decision_hash(*args) == compute_decision_hash(*args)


def test_decision_hash_changes_with_any_field():
    base = compute_decision_hash("BUY ETH", "Good flow", 85, "This is a test.")
    assert compute_decision_hash("SELL ETH", "Good flow", 85, "This is a test.") != base
    assert compute_decision_hash("BUY ETH", "Bad flow", 85, "This is a test.") != base
    assert compute_decision_hash("BUY ETH", "Good flow", 86, "This is a test.") != base
    assert compute_decision_hash("BUY ETH", "Good flow", 85, "Different.") != base


def test_decision_hash_returns_0x_prefixed_32_bytes():
    result = compute_decision_hash("a", "b", 1, "c")
    assert result.startswith("0x")
    assert len(result) == 66  # 0x + 64 hex chars = 32 bytes


def test_legacy_auto_publish_disabled_by_default(monkeypatch):
    monkeypatch.delenv("ENABLE_LEGACY_AUTO_PUBLISH", raising=False)
    from backend.main import _legacy_auto_publish_enabled

    assert _legacy_auto_publish_enabled() is False


def test_legacy_auto_publish_can_be_explicitly_enabled(monkeypatch):
    monkeypatch.setenv("ENABLE_LEGACY_AUTO_PUBLISH", "true")
    from backend.main import _legacy_auto_publish_enabled

    assert _legacy_auto_publish_enabled() is True


def test_decision_hash_for_watch_outcome():
    """Watch receipts use empty recommendation but populated reasoning & brief."""
    h = compute_decision_hash(
        recommendation="",
        reasoning="Market signals mixed; monitoring for cleaner alignment.",
        confidence_score=40,
        plain_english_brief="Signal agreement below threshold. Watch for rotation.",
    )
    assert h.startswith("0x") and len(h) == 66
    # Must be deterministic
    assert h == compute_decision_hash(
        "", "Market signals mixed; monitoring for cleaner alignment.",
        40, "Signal agreement below threshold. Watch for rotation.",
    )


def test_decision_hash_for_no_trade_outcome():
    """No-trade receipts may have empty recommendation and reasoning."""
    h = compute_decision_hash(
        recommendation="",
        reasoning="",
        confidence_score=15,
        plain_english_brief="Signal agreement below threshold.",
    )
    assert h.startswith("0x") and len(h) == 66
    # Differs from watch hash with different inputs
    watch_h = compute_decision_hash(
        "", "some reasoning", 40, "Signal agreement below threshold.",
    )
    assert h != watch_h
