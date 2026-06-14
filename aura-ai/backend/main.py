"""FastAPI entry point for AURA AI."""

from __future__ import annotations

import time
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend import config
from backend.agents.capital_flow_agent import run_capital_flow_agent
from backend.agents.macro_agent import run_macro_agent
from backend.agents.narrative_agent import run_narrative_agent
from backend.agents.risk_agent import run_risk_agent
from backend.agents.sentiment_agent import run_sentiment_agent
from backend.agents.strategy_agent import run_strategy_agent
from backend.data_fetcher import fetch_all_data
from backend.engine.decision_engine import run_decision_engine
from backend.engine.strategy_generator import run_strategy_generator
from backend.models import AuraRequest, AuraResponse, ErrorResponse, StrategySpec

app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _env_state(name: str) -> str:
    import os

    return "configured" if os.getenv(name) else "missing"


@app.on_event("startup")
async def startup_event() -> None:
    print(f"AURA AI Backend running on http://localhost:{config.APP_PORT}")
    print(f"CMC API: {_env_state('CMC_API_KEY')}")
    print(f"Gemini API: {_env_state('GEMINI_API_KEY')}")


@app.get("/health")
async def health() -> dict[str, Any]:
    return {"status": "ok", "version": config.APP_VERSION, "service": config.APP_NAME}


async def _run_signal_pipeline() -> dict[str, Any]:
    print(f"[{_utc_now().isoformat()}] Step 1: fetching data")
    data = await fetch_all_data()
    print(f"[{_utc_now().isoformat()}] Step 2: running agents")
    narrative = run_narrative_agent(data)
    sentiment = run_sentiment_agent(data)
    capital_flow = run_capital_flow_agent(data)
    macro = run_macro_agent(data)
    risk = run_risk_agent(narrative, sentiment, capital_flow, macro)
    strategy = run_strategy_agent(narrative, risk, capital_flow)
    decision = run_decision_engine(narrative, sentiment, capital_flow, macro, risk, strategy)
    return {
        "data": data,
        "narrative": narrative,
        "sentiment": sentiment,
        "capital_flow": capital_flow,
        "macro": macro,
        "risk": risk,
        "strategy": strategy,
        "decision_engine": decision,
    }


@app.get("/aura/signals")
async def aura_signals() -> dict[str, Any]:
    signals = await _run_signal_pipeline()
    return signals


@app.post("/aura/run")
async def aura_run(payload: AuraRequest | None = None) -> dict[str, Any]:
    try:
        start = time.perf_counter()
        _ = payload
        signals = await _run_signal_pipeline()
        print(f"[{_utc_now().isoformat()}] Step 3: generating strategy")
        generated = await run_strategy_generator(signals)
        strategy_spec_data = generated.get("strategy_spec") or {}
        response = AuraResponse(
            status="trade_signal" if signals["decision_engine"]["proceed"] else "no_trade",
            plain_english_brief=generated.get("plain_english_brief") or "AURA fallback strategy generated.",
            strategy_spec=StrategySpec(**strategy_spec_data),
            confidence_score=int(strategy_spec_data.get("confidence_score") or signals["decision_engine"]["confidence_score"]),
            regime_label=signals["decision_engine"]["regime_label"],
            timestamp=_utc_now(),
            all_signals=signals,
            generated_by_fallback=bool(generated.get("generated_by_fallback")),
        )
        print(f"[{_utc_now().isoformat()}] Pipeline completed in {time.perf_counter() - start:.2f}s")
        return response.model_dump()
    except Exception as exc:  # pragma: no cover - API safety net
        print(f"[{_utc_now().isoformat()}] ERROR /aura/run failed: {exc}")
        return ErrorResponse(error="pipeline_error", message=str(exc), timestamp=_utc_now()).model_dump()


@app.post("/aura/backtest-spec")
async def aura_backtest_spec(strategy_spec: dict[str, Any]) -> dict[str, Any]:
    return {
        "freqtrade": {
            "buy_signal": strategy_spec.get("entry_condition"),
            "sell_signal": strategy_spec.get("exit_condition"),
            "stoploss": strategy_spec.get("stop_loss"),
            "take_profit": strategy_spec.get("take_profit"),
            "position_size": strategy_spec.get("position_size"),
            "timeframe": strategy_spec.get("timeframe"),
            "asset_universe": strategy_spec.get("asset_universe"),
            "reasoning": strategy_spec.get("reasoning"),
        },
        "original_strategy_spec": strategy_spec,
    }
