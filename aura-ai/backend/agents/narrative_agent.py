"""Narrative agent: identifies the strongest rotating crypto sector."""

from __future__ import annotations

from typing import Any

from backend.config import AI_WEIGHT, NARRATIVE_WEIGHT, PERPDEX_WEIGHT


def _clamp_score(value: float) -> int:
    return max(0, min(100, int(round(value))))


def _category(data: dict[str, Any] | None, key: str) -> float:
    if not data:
        return 0.0
    return float(data.get(key) or 0.0)


def run_narrative_agent(data: dict[str, Any] | None) -> dict[str, Any]:
    """Score RWA, AI, and PerpDEX narrative momentum."""

    data = data or {}
    cmc = data.get("cmc") or {}
    bnb = data.get("bnb") or {}

    rwa_volume = _category(cmc.get("rwa_category"), "volume_change_24h")
    rwa_mcap = _category(cmc.get("rwa_category"), "market_cap_change_24h")
    ai_volume = _category(cmc.get("ai_category"), "volume_change_24h")
    ai_mcap = _category(cmc.get("ai_category"), "market_cap_change_24h")
    perp_volume = _category(cmc.get("perpdex_category"), "volume_change_24h")
    perp_mcap = _category(cmc.get("perpdex_category"), "market_cap_change_24h")
    pancake_volume = float(bnb.get("pancakeswap_volume_change_24h") or 0.0)

    rwa_score = _clamp_score((rwa_volume * NARRATIVE_WEIGHT["volume"]) + (rwa_mcap * NARRATIVE_WEIGHT["market_cap"]) + (pancake_volume * NARRATIVE_WEIGHT["pancakeswap_volume"]))
    ai_score = _clamp_score((ai_volume * AI_WEIGHT["volume"]) + (ai_mcap * AI_WEIGHT["market_cap"]))
    perpdex_score = _clamp_score((perp_volume * PERPDEX_WEIGHT["volume"]) + (perp_mcap * PERPDEX_WEIGHT["market_cap"]))

    scores = {"RWA": rwa_score, "AI": ai_score, "PerpDEX": perpdex_score}
    top_sector = max(scores, key=scores.get)
    top_score = scores[top_sector]
    momentum = "strong" if top_score >= 60 else "moderate" if top_score >= 40 else "weak"

    return {
        "top_sector": top_sector,
        "top_score": top_score,
        "momentum": momentum,
        "scores": scores,
        "is_positive": top_score >= 60,
    }
