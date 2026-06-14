"""Gemini-powered strategy generation for AURA AI."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

import google.generativeai as genai

from backend.config import GEMINI_MAX_TOKENS, GEMINI_MODEL, GEMINI_TEMPERATURE, SECTOR_TOKENS


def _fallback_strategy(all_signals: dict[str, Any]) -> dict[str, Any]:
    narrative = all_signals.get("narrative") or {}
    risk = all_signals.get("risk") or {}
    capital_flow = all_signals.get("capital_flow") or {}
    sector = narrative.get("top_sector") or "RWA"
    mapping = SECTOR_TOKENS.get(sector, SECTOR_TOKENS["RWA"])
    confidence = int((all_signals.get("decision_engine") or {}).get("confidence_score") or 50)
    return {
        "generated_by_fallback": True,
        "plain_english_brief": f"Fallback AURA output: {sector} remains the leading rotation candidate. Institutional flow is {capital_flow.get('institutional_total_formatted', '$0')} and risk state is {risk.get('risk_level', 'unknown')}.",
        "strategy_spec": {
            "active_narrative": sector,
            "regime": str((all_signals.get("macro") or {}).get("regime") or "neutral"),
            "recommendation": f"Rotate into {', '.join(mapping['primary'])} on BNB Chain",
            "entry_condition": "Enter when institutional flow remains confirmed and narrative momentum stays above threshold.",
            "exit_condition": "Exit when institutional inflow weakens or the decision engine stops proceeding.",
            "stop_loss": "8% below entry price",
            "take_profit": "25% above entry price",
            "position_size": str((all_signals.get("strategy") or {}).get("position_size") or "6% of portfolio"),
            "timeframe": "Weekly rebalance",
            "confidence_score": confidence,
            "asset_universe": mapping["primary"] + mapping["secondary"],
            "reasoning": "Generated from deterministic fallback logic because the Gemini API was unavailable or returned invalid JSON.",
            "backtesting_assumptions": {
                "data_source": "CoinMarketCap historical OHLCV",
                "benchmark": "BNB Chain TVL growth",
                "rebalance_frequency": "weekly",
                "minimum_liquidity": "$1M daily volume",
            },
        },
    }


def _extract_json_text(raw_text: str) -> dict[str, Any]:
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
    return json.loads(cleaned)


async def run_strategy_generator(all_signals: dict[str, Any]) -> dict[str, Any]:
    """Call Gemini and parse the returned JSON strategy spec."""

    import os

    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return _fallback_strategy(all_signals)

    system_prompt = (
        "You are AURA, an institutional-grade crypto strategy AI. You analyze multi-signal market data "
        "and generate precise, backtestable trading strategy specifications for BNB Chain assets. "
        "Your output must be structured, specific, and actionable. Never be vague."
    )
    user_prompt = json.dumps({"instruction": "Return ONLY the JSON object described below.", "signals": all_signals, "required_schema": {
        "plain_english_brief": "2-3 sentence max. Write like a Bloomberg terminal alert. Be specific about which tokens, why, and what the trigger was.",
        "strategy_spec": {
            "active_narrative": "RWA",
            "regime": "risk-on",
            "recommendation": "Rotate 20% into ONDO and BUIDL on BNB Chain",
            "entry_condition": "RWA TVL on BSC > $600M AND Fear & Greed > 35 AND narrative score > 60",
            "exit_condition": "RWA TVL drops 10% week-over-week OR Fear & Greed falls below 25 OR narrative score < 40",
            "stop_loss": "8% below entry price",
            "take_profit": "25% above entry price",
            "position_size": "20% of portfolio",
            "timeframe": "Weekly rebalance",
            "confidence_score": 85,
            "asset_universe": ["ONDO", "BUIDL", "CFG"],
            "reasoning": "Specific reasoning based on the actual signal data provided",
            "backtesting_assumptions": {
                "data_source": "CoinMarketCap historical OHLCV",
                "benchmark": "BNB Chain TVL growth",
                "rebalance_frequency": "weekly",
                "minimum_liquidity": "$1M daily volume",
            },
        },
    }}, ensure_ascii=False)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name=GEMINI_MODEL,
            system_instruction=system_prompt,
            generation_config={
                "temperature": GEMINI_TEMPERATURE,
                "max_output_tokens": GEMINI_MAX_TOKENS,
                "response_mime_type": "application/json",
            },
        )
        response = model.generate_content(user_prompt)
        raw_text = getattr(response, "text", None) or ""
        parsed = _extract_json_text(raw_text)
        parsed["generated_by_fallback"] = False
        return parsed
    except Exception as exc:  # pragma: no cover - external API failure path
        print(f"[{datetime.now(timezone.utc).isoformat()}] ERROR strategy_generator failed: {exc}")
        print(f"[{datetime.now(timezone.utc).isoformat()}] RAW RESPONSE: {locals().get('raw_text', '')}")
        return _fallback_strategy(all_signals)
