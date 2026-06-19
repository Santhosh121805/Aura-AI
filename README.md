<div align="center">

# 🌌 AURA AI
### AI Capital-Rotation Engine for BNB Chain

[![Hackathon](https://img.shields.io/badge/BNB%20Hack-AI%20Trading%20Agent%20Edition-F0B90B?style=for-the-badge&logo=binance&logoColor=white)](#)
[![Track](https://img.shields.io/badge/Track%202-Strategy%20Skills-1E90FF?style=for-the-badge)](#)
[![Prize](https://img.shields.io/badge/Prize%20Pool-%246%2C000-22C55E?style=for-the-badge)](#)
[![LLM](https://img.shields.io/badge/Reasoning-Claude%20API-D97757?style=for-the-badge)](#)

**Reads CMC + BNB Chain data → detects capital rotation → outputs a backtestable strategy spec.**

</div>

---

## 💡 What It Does

AURA is a **CMC Skill** that watches institutional RWA inflows (BlackRock BUIDL, Franklin Templeton iBENJI) into BNB Chain as a **leading indicator**, combines it with narrative momentum + macro regime, and outputs a clean rotation strategy — JSON spec, plain-English brief, and a confidence score.

```json
{
  "active_narrative": "RWA",
  "regime": "risk-on",
  "recommendation": "Rotate 20% into RWA-aligned BNB Chain assets",
  "entry_condition": "RWA TVL rising AND Fear & Greed > 35",
  "exit_condition": "RWA TVL drops 10% OR Fear & Greed < 25",
  "confidence_score": 78,
  "reasoning": "Institutional RWA inflows on BNB Chain rose this week — a historical leading indicator for ecosystem rotation."
}
```

---

## 🏗️ Architecture

```mermaid
flowchart TD
    U[👤 User Query] --> COLLECT

    subgraph COLLECT [📡 Data Layer]
        C1[📊 CMC Agent Hub<br/>Narratives · Fear & Greed · ETF Flows]
        C2[⛓️ BNB Chain SDK<br/>RWA TVL · Institutional Inflows]
        C3[🥞 PancakeSwap<br/>On-chain Volume]
    end

    COLLECT --> BRAIN

    subgraph BRAIN [🧠 Agents]
        A1[📰 Narrative]
        A2[😨 Sentiment]
        A3[🏦 Capital Flow]
        A4[🌍 Macro]
    end

    BRAIN --> RISK[⚠️ Risk Agent]
    RISK --> DECIDE{Signals Aligned?}
    DECIDE -- No --> HOLD[⏸️ Hold]
    DECIDE -- Yes --> STRAT[🎯 Strategy Agent + Claude]
    STRAT --> OUT[📦 JSON Spec + Brief + Confidence]
```

**6 agents:** 📰 Narrative · 😨 Sentiment · 🏦 Capital Flow *(the moat)* · 🌍 Macro · ⚠️ Risk · 🎯 Strategy

---

## 🛠️ Tech Stack

`Python` `FastAPI` `Anthropic Claude API` `CoinMarketCap Agent Hub (MCP)` `BNB Chain SDK` `PancakeSwap API`

---

## 📂 Structure

```
aura-ai/
├── main.py                # FastAPI entry point
├── agents/                # narrative, sentiment, capital_flow, macro, risk, strategy
├── core/                  # decision_engine.py, strategy_generator.py
├── data/                  # cmc_fetcher.py, bnb_fetcher.py
├── skill.json             # CMC Agent Hub skill definition
└── requirements.txt
```

---

## 🚀 Run It

```bash
git clone https://github.com/<your-username>/aura-ai.git
cd aura-ai
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env        # add CMC_API_KEY + ANTHROPIC_API_KEY

uvicorn main:app --reload --port 8000
```

**Call it:**

```bash
curl -X POST http://localhost:8000/api/rotate \
  -H "Content-Type: application/json" \
  -d '{"user_type": "fund_manager"}'
```

---

## 🏆 Why It Wins

| Criteria | AURA |
|---|---|
| ⚙️ Technical | Live multi-agent pipeline, real CMC + BNB Chain data |
| 🌟 Originality | Institutional RWA flow as a leading indicator — unexplored angle |
| 🌍 Relevance | Solves "where do I rotate capital" for real users |
| 🎬 Demo | One call → spec + brief + confidence, instantly readable |

**Special prize fit:** 🔵 Best Use of Agent Hub · 🟡 Best Use of BNB AI Agent SDK

---



---

<div align="center">

**🌌 Read the market. Spot the rotation. Act before retail does.**

</div>
