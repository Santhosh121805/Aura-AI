"""FastAPI entry point for AURA AI."""

from __future__ import annotations

import asyncio
import json
import time
from datetime import datetime, timezone
from typing import Any, AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from backend import config

load_dotenv()
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


def _sse_event(event: str, data: Any) -> str:
    """Format a Server-Sent Event message."""
    payload = json.dumps(data, default=str)
    return f"event: {event}\ndata: {payload}\n\n"


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


async def _stream_pipeline() -> AsyncGenerator[str, None]:
    """Stream real-time agent progress via SSE."""
    start = time.perf_counter()

    try:
        # Step 1: Fetching data
        yield _sse_event("step", {
            "step": "fetch_data",
            "label": "Fetching market data",
            "detail": "Pulling CoinMarketCap, BNB Chain & PancakeSwap feeds…",
            "status": "running",
        })
        await asyncio.sleep(0)
        data = await fetch_all_data()
        yield _sse_event("step", {
            "step": "fetch_data",
            "label": "Market data fetched",
            "detail": "CMC + BNB Chain data loaded successfully",
            "status": "done",
        })

        # Step 2: Narrative Agent
        yield _sse_event("step", {
            "step": "narrative_agent",
            "label": "Narrative Agent",
            "detail": "Scoring RWA, AI & PerpDEX momentum…",
            "status": "running",
        })
        await asyncio.sleep(0)
        narrative = run_narrative_agent(data)
        yield _sse_event("agent_result", {
            "agent": "narrative",
            "label": "Narrative Agent",
            "result": narrative,
            "summary": f"Top sector: {narrative.get('top_sector')} · Score: {narrative.get('top_score')} · {narrative.get('momentum')} momentum",
            "status": "done",
            "is_positive": narrative.get("is_positive"),
        })

        # Step 3: Sentiment Agent
        yield _sse_event("step", {
            "step": "sentiment_agent",
            "label": "Sentiment Agent",
            "detail": "Reading Fear & Greed index…",
            "status": "running",
        })
        await asyncio.sleep(0)
        sentiment = run_sentiment_agent(data)
        yield _sse_event("agent_result", {
            "agent": "sentiment",
            "label": "Sentiment Agent",
            "result": sentiment,
            "summary": f"Fear & Greed: {sentiment.get('fear_greed_label')} ({sentiment.get('fear_greed_value')}) · Momentum: {sentiment.get('market_momentum')}",
            "status": "done",
            "is_positive": sentiment.get("is_positive"),
        })

        # Step 4: Capital Flow Agent
        yield _sse_event("step", {
            "step": "capital_flow_agent",
            "label": "Capital Flow Agent",
            "detail": "Detecting institutional RWA inflows on BNB Chain…",
            "status": "running",
        })
        await asyncio.sleep(0)
        capital_flow = run_capital_flow_agent(data)
        yield _sse_event("agent_result", {
            "agent": "capital_flow",
            "label": "Capital Flow Agent",
            "result": capital_flow,
            "summary": f"Signal: {capital_flow.get('signal')} · Total: {capital_flow.get('institutional_total_formatted')}",
            "status": "done",
            "is_positive": capital_flow.get("is_positive"),
        })

        # Step 5: Macro Agent
        yield _sse_event("step", {
            "step": "macro_agent",
            "label": "Macro Agent",
            "detail": "Analysing BTC dominance & macro regime…",
            "status": "running",
        })
        await asyncio.sleep(0)
        macro = run_macro_agent(data)
        yield _sse_event("agent_result", {
            "agent": "macro",
            "label": "Macro Agent",
            "result": macro,
            "summary": f"Regime: {macro.get('regime')} · BTC dominance: {macro.get('btc_dominance')}%",
            "status": "done",
            "is_positive": macro.get("is_positive"),
        })

        # Step 6: Risk Agent
        yield _sse_event("step", {
            "step": "risk_agent",
            "label": "Risk Agent",
            "detail": "Cross-checking all signals for bias & risk flags…",
            "status": "running",
        })
        await asyncio.sleep(0)
        risk = run_risk_agent(narrative, sentiment, capital_flow, macro)
        yield _sse_event("agent_result", {
            "agent": "risk",
            "label": "Risk Agent",
            "result": risk,
            "summary": f"Safe to trade: {risk.get('safe_to_trade')} · Risk: {risk.get('risk_level')} · Score: {risk.get('risk_score')}",
            "status": "done",
            "is_positive": risk.get("is_positive"),
        })

        # Step 7: Strategy Agent
        yield _sse_event("step", {
            "step": "strategy_agent",
            "label": "Strategy Agent",
            "detail": "Building rotation strategy specification…",
            "status": "running",
        })
        await asyncio.sleep(0)
        strategy = run_strategy_agent(narrative, risk, capital_flow)
        yield _sse_event("agent_result", {
            "agent": "strategy",
            "label": "Strategy Agent",
            "result": strategy,
            "summary": f"Sector: {strategy.get('sector')} · Tokens: {', '.join(strategy.get('primary_tokens') or [])} · Size: {strategy.get('position_size')}",
            "status": "done",
            "is_positive": True,
        })

        # Step 8: Decision Engine
        yield _sse_event("step", {
            "step": "decision_engine",
            "label": "Decision Engine",
            "detail": "Negotiating consensus across all agents…",
            "status": "running",
        })
        await asyncio.sleep(0)
        decision = run_decision_engine(narrative, sentiment, capital_flow, macro, risk, strategy)
        yield _sse_event("agent_result", {
            "agent": "decision",
            "label": "Decision Engine",
            "result": decision,
            "summary": f"Proceed: {decision.get('proceed')} · Confidence: {decision.get('confidence_score')}% · {decision.get('regime_label')}",
            "status": "done",
            "is_positive": decision.get("proceed"),
        })

        signals = {
            "data": data,
            "narrative": narrative,
            "sentiment": sentiment,
            "capital_flow": capital_flow,
            "macro": macro,
            "risk": risk,
            "strategy": strategy,
            "decision_engine": decision,
        }

        # Step 9: Strategy Generator (Gemini)
        if decision.get("proceed"):
            yield _sse_event("step", {
                "step": "strategy_generator",
                "label": "Gemini Strategy Generator",
                "detail": "Composing plain-English brief & backtestable spec with Gemini…",
                "status": "running",
            })
            generated = await run_strategy_generator(signals)
            strategy_spec_data = generated.get("strategy_spec") or {}
            response = AuraResponse(
                status="trade_signal",
                plain_english_brief=generated.get("plain_english_brief") or "AURA fallback strategy generated.",
                strategy_spec=StrategySpec(**strategy_spec_data),
                confidence_score=int(strategy_spec_data.get("confidence_score") or decision["confidence_score"]),
                regime_label=decision["regime_label"],
                timestamp=_utc_now(),
                all_signals=signals,
                generated_by_fallback=bool(generated.get("generated_by_fallback")),
            )
        else:
            response = AuraResponse(
                status="no_trade",
                plain_english_brief=decision.get("wait_message") or "Signal agreement below threshold.",
                strategy_spec=StrategySpec(),
                confidence_score=decision["confidence_score"],
                regime_label=decision["regime_label"],
                timestamp=_utc_now(),
                all_signals=signals,
                generated_by_fallback=False,
            )

        elapsed = round(time.perf_counter() - start, 2)
        yield _sse_event("complete", {
            "status": response.status,
            "plain_english_brief": response.plain_english_brief,
            "strategy_spec": response.strategy_spec.model_dump() if response.strategy_spec else {},
            "confidence_score": response.confidence_score,
            "regime_label": response.regime_label,
            "elapsed_seconds": elapsed,
            "generated_by_fallback": response.generated_by_fallback,
            "all_signals": signals,
        })

    except Exception as exc:
        print(f"[{_utc_now().isoformat()}] ERROR in stream pipeline: {exc}")
        yield _sse_event("error", {"message": str(exc)})


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


@app.get("/aura/run/stream")
async def aura_run_stream() -> StreamingResponse:
    """Stream real-time agent progress via Server-Sent Events."""
    return StreamingResponse(
        _stream_pipeline(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


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
