"""Decision engine that gates strategy generation based on signal alignment."""

from __future__ import annotations

from typing import Any


def run_decision_engine(narrative: dict[str, Any] | None, sentiment: dict[str, Any] | None, capital_flow: dict[str, Any] | None, macro: dict[str, Any] | None, risk: dict[str, Any] | None, strategy: dict[str, Any] | None) -> dict[str, Any]:
    """Count signal agreement and determine whether to proceed."""

    narrative = narrative or {}
    sentiment = sentiment or {}
    capital_flow = capital_flow or {}
    macro = macro or {}
    risk = risk or {}
    strategy = strategy or {}

    positive_values = [bool(narrative.get("is_positive")), bool(sentiment.get("is_positive")), bool(capital_flow.get("is_positive")), bool(macro.get("is_positive")), bool(risk.get("is_positive")), bool(risk.get("safe_to_trade"))]
    agreement_count = sum(1 for value in positive_values if value)

    if agreement_count >= 5:
        confidence_level = "high"
        proceed = True
        confidence_score = 75 + (agreement_count - 4) * 10
    elif agreement_count >= 3:
        confidence_level = "medium"
        proceed = True
        confidence_score = 45 + agreement_count * 7
    else:
        confidence_level = "low"
        proceed = False
        confidence_score = agreement_count * 15

    top_sector = str(strategy.get("sector") or narrative.get("top_sector") or "RWA")
    if proceed and top_sector == "RWA":
        regime_label = "RWA momentum on BNB Chain"
    elif proceed and top_sector == "AI":
        regime_label = "AI token rotation"
    elif proceed and top_sector == "PerpDEX":
        regime_label = "PerpDEX momentum"
    else:
        regime_label = "Mixed signals — no clear rotation"

    wait_message = None if proceed else "Signal agreement below threshold. Wait for cleaner alignment before rotating capital."
    return {
        "proceed": proceed,
        "confidence_level": confidence_level,
        "confidence_score": int(confidence_score),
        "agreement_count": agreement_count,
        "regime_label": regime_label,
        "wait_message": wait_message,
    }
