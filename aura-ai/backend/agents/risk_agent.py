"""Risk agent: determines whether the signal stack is safe enough to trade."""

from __future__ import annotations

from typing import Any


def run_risk_agent(narrative: dict[str, Any] | None, sentiment: dict[str, Any] | None, capital_flow: dict[str, Any] | None, macro: dict[str, Any] | None) -> dict[str, Any]:
    """Combine agent polarity into an overall trade-risk assessment."""

    narrative = narrative or {}
    sentiment = sentiment or {}
    capital_flow = capital_flow or {}
    macro = macro or {}

    positives = [bool(narrative.get("is_positive")), bool(sentiment.get("is_positive")), bool(capital_flow.get("is_positive")), bool(macro.get("is_positive"))]
    positive_count = sum(1 for item in positives if item)

    if positive_count == 4:
        safe_to_trade, risk_level, risk_score = True, "low", 85
    elif positive_count == 3:
        safe_to_trade, risk_level, risk_score = True, "moderate", 65
    elif positive_count == 2:
        safe_to_trade, risk_level, risk_score = False, "high", 40
    else:
        safe_to_trade, risk_level, risk_score = False, "very_high", 15

    pieces = []
    labels = [
        ("narrative", narrative.get("is_positive"), "strong narrative momentum", "weak narrative momentum"),
        ("sentiment", sentiment.get("is_positive"), "improving sentiment", "fragile sentiment"),
        ("capital_flow", capital_flow.get("is_positive"), "confirmed institutional inflow", "no confirmed institutional inflow"),
        ("macro", macro.get("is_positive"), "risk-on macro regime", "risk-off macro regime"),
    ]
    for _, is_positive, good_text, bad_text in labels:
        pieces.append(good_text if is_positive else bad_text)
    risk_reason = f"{positive_count}/4 signals aligned: " + ", ".join(pieces) + "."

    return {
        "safe_to_trade": safe_to_trade,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "positive_signal_count": positive_count,
        "risk_reason": risk_reason,
        "is_positive": safe_to_trade,
    }
