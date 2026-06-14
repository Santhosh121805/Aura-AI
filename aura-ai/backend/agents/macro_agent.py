"""Macro agent: estimates market regime from broad market context."""

from __future__ import annotations

from typing import Any


def run_macro_agent(data: dict[str, Any] | None) -> dict[str, Any]:
    """Classify market regime and dominance context."""

    data = data or {}
    cmc = data.get("cmc") or {}
    fear_greed = float(cmc.get("fear_greed") or 30)
    btc_dominance = float(cmc.get("btc_dominance") or 50.0)
    market_cap_change = float(cmc.get("total_market_cap_change_24h") or 0.0)

    if fear_greed >= 50 and btc_dominance < 56 and market_cap_change > 0:
        regime, confidence = "risk-on", 84
    elif fear_greed >= 35 and market_cap_change > -1.5:
        regime, confidence = "neutral", 63
    else:
        regime, confidence = "risk-off", 42

    if btc_dominance > 58:
        interpretation = "flight to safety — altcoin headwinds"
    elif btc_dominance >= 52:
        interpretation = "moderate dominance — selective altcoin opportunity"
    else:
        interpretation = "altcoin season — broad opportunity"

    return {
        "regime": regime,
        "confidence": confidence,
        "btc_dominance": btc_dominance,
        "dominance_interpretation": interpretation,
        "is_positive": regime in {"risk-on", "neutral"},
    }
