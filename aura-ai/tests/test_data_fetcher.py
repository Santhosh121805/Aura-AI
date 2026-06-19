"""Unit tests for data_fetcher.py"""

import pytest
from backend.data_fetcher import fetch_all_data


@pytest.mark.asyncio
async def test_fetch_all_data_returns_dict():
    """Test that fetch_all_data returns a dict with cmc and bnb keys"""
    data = await fetch_all_data()
    assert isinstance(data, dict)
    assert "cmc" in data
    assert "bnb" in data
    assert "timestamp" in data


@pytest.mark.asyncio
async def test_fetch_cmc_data_structure():
    """Test that CMC data contains expected keys"""
    data = await fetch_all_data()
    cmc = data.get("cmc", {})
    assert "fear_greed" in cmc
    assert "total_market_cap_change_24h" in cmc
    assert "btc_dominance" in cmc
    assert "rwa_category" in cmc
    assert "ai_category" in cmc
    assert "perpdex_category" in cmc


@pytest.mark.asyncio
async def test_fetch_bnb_data_structure():
    """Test that BNB data contains expected keys"""
    data = await fetch_all_data()
    bnb = data.get("bnb", {})
    assert "ondo_tvl_bsc" in bnb
    assert "buidl_tvl_bsc" in bnb
    assert "bsc_total_tvl" in bnb
    assert "pancakeswap_volume_change_24h" in bnb


@pytest.mark.asyncio
async def test_category_structure():
    """Test that category data has volume and market cap changes"""
    data = await fetch_all_data()
    rwa = data["cmc"]["rwa_category"]
    assert isinstance(rwa.get("volume_change_24h"), (int, float))
    assert isinstance(rwa.get("market_cap_change_24h"), (int, float))
    assert isinstance(rwa.get("num_tokens"), int)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
