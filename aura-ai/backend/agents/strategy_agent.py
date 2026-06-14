"""Strategy agent: selects the tradeable sector and position size."""

from __future__ import annotations

from typing import Any

from backend.config import POSITION_SIZE_THRESHOLDS, SECTOR_TOKENS


def _size_from_risk(risk_score: int) -> tuple[str, str]:
    for threshold, size, label in POSITION_SIZE_THRESHOLDS:
        if risk_score >= threshold:
            return size, label
    return "0%", "No trade"


def run_strategy_agent(narrative: dict[str, Any] | None, risk: dict[str, Any] | None, capital_flow: dict[str, Any] | None) -> dict[str, Any]:
    """Build a tactical sector recommendation from the current signal stack."""

    narrative = narrative or {}
    risk = risk or {}
    capital_flow = capital_flow or {}

    sector = str(narrative.get("top_sector") or "RWA")
    risk_score = int(risk.get("risk_score") or 0)
    position_size, size_label = _size_from_risk(risk_score)
    mapping = SECTOR_TOKENS.get(sector, SECTOR_TOKENS["RWA"])
    rationale = f"Institutional inflow of {capital_flow.get('institutional_total_formatted', '$0')} confirmed on BNB Chain with {narrative.get('momentum', 'weak')} narrative momentum."

    return {
        "sector": sector,
        "primary_tokens": mapping["primary"],
        "secondary_tokens": mapping["secondary"],
        "sector_description": mapping["description"],
        "position_size": position_size,
        "size_label": size_label,
        "rationale": rationale,
    }
