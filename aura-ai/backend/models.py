"""Pydantic models for AURA AI request and response payloads."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class AuraRequest(BaseModel):
    """Incoming request for the AURA pipeline."""

    user_query: str = Field(default="Generate rotation strategy", description="Optional user context")


class StrategyBacktestingAssumptions(BaseModel):
    """Optional nested assumptions included in generated strategy specs."""

    data_source: str
    benchmark: str
    rebalance_frequency: str
    minimum_liquidity: str


class StrategySpec(BaseModel):
    """Structured, backtestable strategy specification returned by AURA."""

    active_narrative: str = ""
    regime: str = ""
    recommendation: str = ""
    entry_condition: str = ""
    exit_condition: str = ""
    stop_loss: str = ""
    take_profit: str = ""
    position_size: str = "0%"
    timeframe: str = ""
    confidence_score: int = Field(default=0, ge=0, le=100)
    asset_universe: list[str] = Field(default_factory=list)
    reasoning: str = ""
    backtesting_assumptions: StrategyBacktestingAssumptions | None = None


class AuraResponse(BaseModel):
    """Top-level response for the strategy pipeline."""

    status: str
    plain_english_brief: str
    strategy_spec: StrategySpec
    confidence_score: int = Field(ge=0, le=100)
    regime_label: str
    timestamp: datetime
    all_signals: dict[str, Any] | None = None
    generated_by_fallback: bool | None = None


class ErrorResponse(BaseModel):
    """Uniform error envelope for API failures."""

    error: str
    message: str
    timestamp: datetime
