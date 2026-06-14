"""Central configuration for AURA AI.

Keep all cross-cutting constants in one place so the agents, data fetcher,
and API layer share a single source of truth.
"""

from __future__ import annotations

API_BASE_CMC = "https://pro-api.coinmarketcap.com"
API_BASE_DEFILLAMA = "https://api.llama.fi"
API_BASE_THEGRAPH = "https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc"

APP_NAME = "AURA AI"
APP_VERSION = "1.0.0"
APP_PORT = 8000

DEFAULT_TIMEOUT_SECONDS = 10.0
SP500_WEEKLY_CHANGE = 0.8

SECTOR_TOKENS = {
    "RWA": {
        "primary": ["ONDO", "BUIDL"],
        "secondary": ["CFG", "MPL"],
        "description": "Tokenized real-world assets on BNB Chain",
    },
    "AI": {
        "primary": ["ARKM", "NEAR"],
        "secondary": ["FET", "OCEAN"],
        "description": "AI infrastructure and agent tokens",
    },
    "PerpDEX": {
        "primary": ["GMX", "DYDX"],
        "secondary": ["PERP", "SNX"],
        "description": "Perpetual DEX governance tokens",
    },
}

NARRATIVE_WEIGHT = {"volume": 0.4, "market_cap": 0.4, "pancakeswap_volume": 0.2}
AI_WEIGHT = {"volume": 0.5, "market_cap": 0.5}
PERPDEX_WEIGHT = {"volume": 0.5, "market_cap": 0.5}

POSITION_SIZE_THRESHOLDS = (
    (80, "20%", "Full position"),
    (60, "12%", "Reduced position"),
    (40, "6%", "Minimum position"),
    (0, "0%", "No trade"),
)

CMC_DEFAULTS = {
    "fear_greed": 30,
    "fear_greed_label": "Fear",
    "total_market_cap_change_24h": 0.0,
    "btc_dominance": 50.0,
    "rwa_category": {"volume_change_24h": 0.0, "market_cap_change_24h": 0.0, "num_tokens": 0},
    "ai_category": {"volume_change_24h": 0.0, "market_cap_change_24h": 0.0, "num_tokens": 0},
    "perpdex_category": {"volume_change_24h": 0.0, "market_cap_change_24h": 0.0, "num_tokens": 0},
}

BNB_DEFAULTS = {
    "ondo_tvl_bsc": 100_000_000,
    "buidl_tvl_bsc": 500_000_000,
    "pancakeswap_volume_change_24h": 0.0,
    "bsc_total_tvl": 0.0,
}

GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_MAX_TOKENS = 1500
GEMINI_TEMPERATURE = 0.3
