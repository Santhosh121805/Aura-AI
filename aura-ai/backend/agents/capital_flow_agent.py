"""Capital flow agent: detects institutional RWA inflows on BNB Chain."""

from __future__ import annotations

from typing import Any


def _format_usd(value: float) -> str:
    absolute = abs(value)
    if absolute >= 1_000_000_000:
        return f"${value / 1_000_000_000:.1f}B".replace(".0B", "B")
    if absolute >= 1_000_000:
        return f"${value / 1_000_000:.0f}M"
    if absolute >= 1_000:
        return f"${value / 1_000:.0f}K"
    return f"${value:.0f}"


def run_capital_flow_agent(data: dict[str, Any] | None) -> dict[str, Any]:
    """Measure institutional capital concentration and inflow strength."""

    data = data or {}
    bnb = data.get("bnb") or {}
    cmc = data.get("cmc") or {}

    ondo_tvl = float(bnb.get("ondo_tvl_bsc") or 100_000_000)
    buidl_tvl = float(bnb.get("buidl_tvl_bsc") or 500_000_000)
    bsc_total_tvl = float(bnb.get("bsc_total_tvl") or 0.0)
    rwa_volume_change = float((cmc.get("rwa_category") or {}).get("volume_change_24h") or 0.0)

    institutional_total = ondo_tvl + buidl_tvl
    institutional_dominance = (institutional_total / bsc_total_tvl * 100) if bsc_total_tvl > 0 else 0.0

    if rwa_volume_change > 10 and institutional_total > 500_000_000:
        signal, confirmed = "strong_inflow", True
    elif rwa_volume_change > 5 or institutional_total > 300_000_000:
        signal, confirmed = "moderate_inflow", True
    else:
        signal, confirmed = "no_significant_inflow", False

    return {
        "signal": signal,
        "confirmed": confirmed,
        "institutional_total_usd": institutional_total,
        "institutional_total_formatted": _format_usd(institutional_total),
        "institutional_dominance_pct": round(institutional_dominance, 2),
        "ondo_tvl": ondo_tvl,
        "buidl_tvl": buidl_tvl,
        "is_positive": confirmed,
    }
