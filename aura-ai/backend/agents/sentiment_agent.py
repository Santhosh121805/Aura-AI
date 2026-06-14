"""Sentiment agent: interprets Fear & Greed and market cap context."""

from __future__ import annotations

from typing import Any


def run_sentiment_agent(data: dict[str, Any] | None) -> dict[str, Any]:
    """Classify market sentiment from CMC signals."""

    data = data or {}
    cmc = data.get("cmc") or {}
    fear_greed = int(cmc.get("fear_greed") or 30)
    market_change = float(cmc.get("total_market_cap_change_24h") or 0.0)

    if fear_greed >= 60:
        signal = "positive"
        label = "Greed"
    elif fear_greed >= 40:
        signal = "neutral"
        label = "Neutral"
    elif fear_greed >= 25:
        signal = "cautious"
        label = "Fear"
    else:
        signal = "negative"
        label = "Extreme Fear"

    ladder = ["negative", "cautious", "neutral", "positive"]
    index = ladder.index(signal)
    if market_change > 1.5 and index < len(ladder) - 1:
        index += 1
    elif market_change < -2.0 and index > 0:
        index -= 1
    signal = ladder[index]

    market_momentum = "accelerating" if market_change > 1.5 else "slight_decline" if market_change < -1.0 else "stable"
    return {
        "signal": signal,
        "fear_greed_value": fear_greed,
        "fear_greed_label": label,
        "market_momentum": market_momentum,
        "is_positive": signal in {"positive", "neutral"},
    }
