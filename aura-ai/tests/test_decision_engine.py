"""Unit tests for decision_engine.py"""

import pytest
from backend.engine.decision_engine import run_decision_engine


def test_decision_engine_all_positive():
    """Test decision engine when all signals are positive"""
    signals = {
        "narrative": {"is_positive": True},
        "sentiment": {"is_positive": True},
        "capital_flow": {"is_positive": True},
        "macro": {"is_positive": True},
        "risk": {"is_positive": True, "safe_to_trade": True},
        "strategy": {"sector": "RWA"},
    }
    
    result = run_decision_engine(
        signals["narrative"],
        signals["sentiment"],
        signals["capital_flow"],
        signals["macro"],
        signals["risk"],
        signals["strategy"],
    )
    
    assert result["proceed"] is True
    assert result["confidence_level"] == "high"
    assert result["confidence_score"] >= 75
    assert "regime_label" in result


def test_decision_engine_mixed_signals():
    """Test decision engine with mixed signals"""
    signals = {
        "narrative": {"is_positive": True},
        "sentiment": {"is_positive": False},
        "capital_flow": {"is_positive": True},
        "macro": {"is_positive": False},
        "risk": {"is_positive": False, "safe_to_trade": False},
        "strategy": {"sector": "RWA"},
    }
    
    result = run_decision_engine(
        signals["narrative"],
        signals["sentiment"],
        signals["capital_flow"],
        signals["macro"],
        signals["risk"],
        signals["strategy"],
    )
    
    assert "confidence_level" in result
    assert "agreement_count" in result
    assert result["agreement_count"] == 2


def test_decision_engine_all_negative():
    """Test decision engine when all signals are negative"""
    signals = {
        "narrative": {"is_positive": False},
        "sentiment": {"is_positive": False},
        "capital_flow": {"is_positive": False},
        "macro": {"is_positive": False},
        "risk": {"is_positive": False, "safe_to_trade": False},
        "strategy": {"sector": "RWA"},
    }
    
    result = run_decision_engine(
        signals["narrative"],
        signals["sentiment"],
        signals["capital_flow"],
        signals["macro"],
        signals["risk"],
        signals["strategy"],
    )
    
    assert result["proceed"] is False
    assert result["confidence_level"] == "low"
    assert result["confidence_score"] < 50
    assert result["wait_message"] is not None


def test_decision_engine_sector_detection():
    """Test decision engine detects sector correctly"""
    signals = {
        "narrative": {"is_positive": True, "top_sector": "AI"},
        "sentiment": {"is_positive": True},
        "capital_flow": {"is_positive": True},
        "macro": {"is_positive": True},
        "risk": {"is_positive": True, "safe_to_trade": True},
        "strategy": {"sector": "AI"},
    }
    
    result = run_decision_engine(
        signals["narrative"],
        signals["sentiment"],
        signals["capital_flow"],
        signals["macro"],
        signals["risk"],
        signals["strategy"],
    )
    
    assert "AI" in result["regime_label"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
