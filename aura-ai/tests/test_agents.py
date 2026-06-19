"""Unit tests for agents"""

import pytest
from backend.agents.narrative_agent import run_narrative_agent
from backend.agents.sentiment_agent import run_sentiment_agent
from backend.agents.capital_flow_agent import run_capital_flow_agent
from backend.agents.macro_agent import run_macro_agent
from backend.agents.risk_agent import run_risk_agent
from backend.agents.strategy_agent import run_strategy_agent


def test_narrative_agent_output_structure():
    """Test narrative agent returns expected structure"""
    data = {
        "cmc": {
            "rwa_category": {"volume_change_24h": 10.0, "market_cap_change_24h": 5.0},
            "ai_category": {"volume_change_24h": 0.0, "market_cap_change_24h": 0.0},
            "perpdex_category": {"volume_change_24h": 0.0, "market_cap_change_24h": 0.0},
        },
        "bnb": {"pancakeswap_volume_change_24h": 0.0},
    }
    result = run_narrative_agent(data)
    assert "top_sector" in result
    assert "top_score" in result
    assert "momentum" in result
    assert "is_positive" in result
    assert result["top_score"] >= 0 and result["top_score"] <= 100


def test_sentiment_agent_output_structure():
    """Test sentiment agent returns expected structure"""
    data = {
        "cmc": {"fear_greed": 50, "total_market_cap_change_24h": 0.5}
    }
    result = run_sentiment_agent(data)
    assert "signal" in result
    assert "fear_greed_value" in result
    assert "fear_greed_label" in result
    assert "is_positive" in result


def test_capital_flow_agent_output_structure():
    """Test capital flow agent returns expected structure"""
    data = {
        "bnb": {
            "ondo_tvl_bsc": 400000000,
            "buidl_tvl_bsc": 500000000,
            "bsc_total_tvl": 7000000000,
        },
        "cmc": {"rwa_category": {"volume_change_24h": 5.0}},
    }
    result = run_capital_flow_agent(data)
    assert "signal" in result
    assert "confirmed" in result
    assert "institutional_total_usd" in result
    assert "institutional_dominance_pct" in result
    assert "is_positive" in result


def test_macro_agent_output_structure():
    """Test macro agent returns expected structure"""
    data = {
        "cmc": {
            "fear_greed": 50,
            "btc_dominance": 50.0,
            "total_market_cap_change_24h": 0.5,
        }
    }
    result = run_macro_agent(data)
    assert "regime" in result
    assert "confidence" in result
    assert "btc_dominance" in result
    assert "is_positive" in result


def test_risk_agent_aggregation():
    """Test risk agent correctly aggregates signals"""
    narrative = {"is_positive": True}
    sentiment = {"is_positive": True}
    capital_flow = {"is_positive": True}
    macro = {"is_positive": True}
    
    result = run_risk_agent(narrative, sentiment, capital_flow, macro)
    assert "safe_to_trade" in result
    assert "risk_level" in result
    assert "positive_signal_count" in result
    assert result["positive_signal_count"] == 4
    assert result["safe_to_trade"] is True


def test_strategy_agent_position_sizing():
    """Test strategy agent correctly sizes position"""
    narrative = {"top_sector": "RWA", "momentum": "strong"}
    risk = {"risk_score": 80}
    capital_flow = {"is_positive": True, "institutional_total_formatted": "$926M"}
    
    result = run_strategy_agent(narrative, risk, capital_flow)
    assert "sector" in result
    assert "position_size" in result
    assert "primary_tokens" in result
    assert result["sector"] == "RWA"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
