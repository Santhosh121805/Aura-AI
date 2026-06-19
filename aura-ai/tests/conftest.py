"""pytest configuration and fixtures for AURA tests"""

import pytest
import asyncio


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def sample_data():
    """Sample market data for testing"""
    return {
        "cmc": {
            "fear_greed": 50,
            "fear_greed_label": "Neutral",
            "total_market_cap_change_24h": 0.5,
            "btc_dominance": 52.0,
            "eth_dominance": 20.0,
            "total_market_cap": 2_000_000_000_000,
            "rwa_category": {
                "volume_change_24h": 10.0,
                "market_cap_change_24h": 5.0,
                "num_tokens": 12,
            },
            "ai_category": {
                "volume_change_24h": 0.0,
                "market_cap_change_24h": 0.0,
                "num_tokens": 0,
            },
            "perpdex_category": {
                "volume_change_24h": 0.0,
                "market_cap_change_24h": 0.0,
                "num_tokens": 0,
            },
        },
        "bnb": {
            "ondo_tvl_bsc": 400_000_000,
            "buidl_tvl_bsc": 500_000_000,
            "bsc_total_tvl": 7_000_000_000,
            "pancakeswap_volume_change_24h": 0.0,
        },
        "timestamp": "2026-06-17T12:00:00Z",
    }


@pytest.fixture
def positive_signals():
    """All signals aligned positively"""
    return {
        "narrative": {
            "top_sector": "RWA",
            "top_score": 75,
            "momentum": "strong",
            "scores": {"RWA": 75, "AI": 20, "PerpDEX": 10},
            "is_positive": True,
        },
        "sentiment": {
            "signal": "positive",
            "fear_greed_value": 65,
            "fear_greed_label": "Greed",
            "market_momentum": "accelerating",
            "is_positive": True,
        },
        "capital_flow": {
            "signal": "strong_inflow",
            "confirmed": True,
            "institutional_total_usd": 926_000_000,
            "institutional_total_formatted": "$926M",
            "institutional_dominance_pct": 13.23,
            "ondo_tvl": 400_000_000,
            "buidl_tvl": 500_000_000,
            "is_positive": True,
        },
        "macro": {
            "regime": "risk-on",
            "confidence": 84,
            "btc_dominance": 52.0,
            "dominance_interpretation": "altcoin season — broad opportunity",
            "is_positive": True,
        },
    }
