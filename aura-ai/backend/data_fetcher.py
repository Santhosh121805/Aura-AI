"""Async data collection for AURA AI.

This module fetches CoinMarketCap, DeFiLlama, and PancakeSwap-derived data,
then normalizes it into the shape expected by the agent layer.
"""

from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone
from typing import Any

import httpx

from backend.config import API_BASE_CMC, API_BASE_DEFILLAMA, API_BASE_THEGRAPH, BNB_DEFAULTS, CMC_DEFAULTS, DEFAULT_TIMEOUT_SECONDS


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _safe_int(value: Any, default: int = 0) -> int:
    try:
        if value is None:
            return default
        return int(float(value))
    except (TypeError, ValueError):
        return default


async def _fetch_json(client: httpx.AsyncClient, url: str, *, headers: dict[str, str] | None = None, params: dict[str, Any] | None = None, method: str = "GET", json_body: dict[str, Any] | None = None) -> dict[str, Any] | None:
    try:
        response = await client.request(method, url, headers=headers, params=params, json=json_body)
        response.raise_for_status()
        return response.json()
    except Exception as exc:  # pragma: no cover - network failure path
        print(f"[{_now_iso()}] ERROR data_fetcher request failed for {url}: {exc}")
        return None


async def _fetch_cmc_global_metrics(client: httpx.AsyncClient, api_key: str | None) -> dict[str, Any]:
    payload = await _fetch_json(
        client,
        f"{API_BASE_CMC}/v1/global-metrics/quotes/latest",
        headers={"X-CMC_PRO_API_KEY": api_key or ""},
    )
    quote = ((payload or {}).get("data") or {}).get("quote", {}).get("USD", {})
    return {
        "total_market_cap_change_24h": _safe_float(quote.get("total_market_cap_yesterday_percentage_change"), CMC_DEFAULTS["total_market_cap_change_24h"]),
        "btc_dominance": _safe_float(((payload or {}).get("data") or {}).get("btc_dominance"), CMC_DEFAULTS["btc_dominance"]),
        "eth_dominance": _safe_float(((payload or {}).get("data") or {}).get("eth_dominance"), 0.0),
        "total_market_cap": _safe_float(quote.get("total_market_cap"), 0.0),
    }


async def _fetch_fear_greed(client: httpx.AsyncClient, api_key: str | None) -> dict[str, Any]:
    payload = await _fetch_json(
        client,
        f"{API_BASE_CMC}/v3/fear-and-greed/latest",
        headers={"X-CMC_PRO_API_KEY": api_key or ""},
    )
    items = ((payload or {}).get("data") or [])
    item = items[0] if items else {}
    value = _safe_int(item.get("value"), CMC_DEFAULTS["fear_greed"])
    label = item.get("value_classification") or CMC_DEFAULTS["fear_greed_label"]
    return {"fear_greed": value, "fear_greed_label": label}


async def _fetch_category(client: httpx.AsyncClient, api_key: str | None, slug: str, fallback_key: str) -> dict[str, Any]:
    payload = await _fetch_json(
        client,
        f"{API_BASE_CMC}/v1/cryptocurrency/category",
        headers={"X-CMC_PRO_API_KEY": api_key or ""},
        params={"slug": slug},
    )
    data = ((payload or {}).get("data") or {})
    quote = data.get("quote", {}).get("USD", {})
    return {
        "volume_change_24h": _safe_float(quote.get("volume_change_24h"), CMC_DEFAULTS[fallback_key]["volume_change_24h"]),
        "market_cap_change_24h": _safe_float(quote.get("market_cap_change_24h"), CMC_DEFAULTS[fallback_key]["market_cap_change_24h"]),
        "num_tokens": _safe_int(data.get("num_tokens"), CMC_DEFAULTS[fallback_key]["num_tokens"]),
    }


async def _fetch_defi_listings(client: httpx.AsyncClient, api_key: str | None) -> list[dict[str, Any]]:
    payload = await _fetch_json(
        client,
        f"{API_BASE_CMC}/v1/cryptocurrency/listings/latest",
        headers={"X-CMC_PRO_API_KEY": api_key or ""},
        params={"tag": "defi", "limit": 20},
    )
    return (payload or {}).get("data") or []


async def _fetch_ondo_tvl(client: httpx.AsyncClient) -> float:
    payload = await _fetch_json(client, f"{API_BASE_DEFILLAMA}/protocol/ondo-finance")
    chains = (payload or {}).get("currentChainTvls") or {}
    return _safe_float(chains.get("BSC"), BNB_DEFAULTS["ondo_tvl_bsc"])


async def _fetch_buidl_tvl(client: httpx.AsyncClient) -> float:
    payload = await _fetch_json(client, f"{API_BASE_DEFILLAMA}/protocol/blackrock-buidl")
    chains = (payload or {}).get("currentChainTvls") or {}
    return _safe_float(chains.get("BSC"), BNB_DEFAULTS["buidl_tvl_bsc"])


async def _fetch_bsc_total_tvl(client: httpx.AsyncClient) -> float:
    payload = await _fetch_json(client, f"{API_BASE_DEFILLAMA}/chains")
    if isinstance(payload, list):
        for chain in payload:
            if str(chain.get("name", "")).lower() in {"bsc", "binance", "bnb chain"}:
                return _safe_float(chain.get("tvl"), BNB_DEFAULTS["bsc_total_tvl"])
    return BNB_DEFAULTS["bsc_total_tvl"]


async def _fetch_pancakeswap_volume_change(client: httpx.AsyncClient) -> float:
    query = """
    { pancakeDayDatas(first: 2, orderBy: date, orderDirection: desc) { volumeUSD txCount } }
    """.strip()
    payload = await _fetch_json(client, API_BASE_THEGRAPH, method="POST", json_body={"query": query})
    rows = (((payload or {}).get("data") or {}).get("pancakeDayDatas") or [])
    if len(rows) < 2:
        return 0.0
    today = _safe_float(rows[0].get("volumeUSD"), 0.0)
    yesterday = _safe_float(rows[1].get("volumeUSD"), 0.0)
    if yesterday <= 0:
        return 0.0
    return round(((today - yesterday) / yesterday) * 100, 2)


async def fetch_all_data() -> dict[str, Any]:
    """Fetch and normalize the complete data bundle used by the agents."""

    api_key = __import__("os").getenv("CMC_API_KEY")
    timeout = httpx.Timeout(DEFAULT_TIMEOUT_SECONDS)
    limits = httpx.Limits(max_keepalive_connections=5, max_connections=10)
    async with httpx.AsyncClient(timeout=timeout, limits=limits) as client:
        global_metrics_task = _fetch_cmc_global_metrics(client, api_key)
        fear_greed_task = _fetch_fear_greed(client, api_key)
        rwa_category_task = _fetch_category(client, api_key, "real-world-assets", "rwa_category")
        ai_category_task = _fetch_category(client, api_key, "artificial-intelligence", "ai_category")
        perpdex_category_task = _fetch_category(client, api_key, "perpetual-dex", "perpdex_category")
        listings_task = _fetch_defi_listings(client, api_key)
        ondo_task = _fetch_ondo_tvl(client)
        buidl_task = _fetch_buidl_tvl(client)
        bsc_tvl_task = _fetch_bsc_total_tvl(client)
        pancake_volume_task = _fetch_pancakeswap_volume_change(client)

        global_metrics, fear_greed, rwa_category, ai_category, perpdex_category, _listings, ondo_tvl, buidl_tvl, bsc_total_tvl, pancake_volume = await asyncio.gather(
            global_metrics_task,
            fear_greed_task,
            rwa_category_task,
            ai_category_task,
            perpdex_category_task,
            listings_task,
            ondo_task,
            buidl_task,
            bsc_tvl_task,
            pancake_volume_task,
            return_exceptions=True,
        )

    def _unwrap(value: Any, fallback: dict[str, Any]) -> dict[str, Any]:
        if isinstance(value, Exception):
            print(f"[{_now_iso()}] ERROR data_fetcher task failed: {value}")
            return fallback
        return value if isinstance(value, dict) else fallback

    cmc = {**CMC_DEFAULTS, **_unwrap(global_metrics, {}), **_unwrap(fear_greed, {}), "rwa_category": _unwrap(rwa_category, CMC_DEFAULTS["rwa_category"]), "ai_category": _unwrap(ai_category, CMC_DEFAULTS["ai_category"]), "perpdex_category": _unwrap(perpdex_category, CMC_DEFAULTS["perpdex_category"])}

    if cmc["fear_greed"] >= 60:
        cmc["fear_greed_label"] = "Greed"
    elif cmc["fear_greed"] >= 40:
        cmc["fear_greed_label"] = "Neutral"
    elif cmc["fear_greed"] >= 25:
        cmc["fear_greed_label"] = "Fear"
    else:
        cmc["fear_greed_label"] = "Extreme Fear"

    bnb = {**BNB_DEFAULTS, "ondo_tvl_bsc": _safe_float(ondo_tvl, BNB_DEFAULTS["ondo_tvl_bsc"]), "buidl_tvl_bsc": _safe_float(buidl_tvl, BNB_DEFAULTS["buidl_tvl_bsc"]), "pancakeswap_volume_change_24h": _safe_float(pancake_volume, BNB_DEFAULTS["pancakeswap_volume_change_24h"]), "bsc_total_tvl": _safe_float(bsc_total_tvl, BNB_DEFAULTS["bsc_total_tvl"])}

    return {"cmc": cmc, "bnb": bnb, "timestamp": _now_iso()}
