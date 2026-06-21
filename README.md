# Aura-AI

**The AI Chief Investment Officer for every crypto investor.**

A CMC Skill built on the CoinMarketCap Agent Hub and BNB Chain that turns live market and on-chain data into a single, backtestable trading decision. Six agents read narrative, sentiment, institutional flow, and macro data in parallel, reach consensus, and output either a strategy spec or a "preserve capital" call.

Built for **BNB Hack — Track 2: Strategy Skills.**

---

## How it works

```mermaid
flowchart TD
    subgraph SRC["Data sources"]
        direction LR
        CMC["CoinMarketCap<br/>Agent Hub"]
        BNB["BNB Chain<br/><sub>institutional RWA flows</sub>"]
        PCS["PancakeSwap"]
    end

    subgraph AGENTS["Six agents"]
        direction LR
        A1["Narrative"]
        A2["Sentiment"]
        A3["Capital Flow"]
        A4["Macro"]
        A5["Risk"]
        A6["Strategy"]
    end

    DEC{"Signals<br/>agree?"}

    OUT_YES["Strategy spec<br/><sub>JSON + confidence score</sub>"]
    OUT_NO["Preserve capital"]

    CMC --> A1
    CMC --> A2
    CMC --> A4
    BNB --> A3
    PCS --> A3

    A1 --> DEC
    A2 --> DEC
    A3 --> DEC
    A4 --> DEC
    A5 --> DEC
    A6 --> DEC

    DEC -->|yes| OUT_YES
    DEC -->|no| OUT_NO

    style CMC fill:#0e2017,stroke:#1d9e75,color:#f2f2f0
    style BNB fill:#0e2017,stroke:#1d9e75,color:#f2f2f0
    style PCS fill:#0e2017,stroke:#1d9e75,color:#f2f2f0
    style DEC fill:#161616,stroke:#f2a623,color:#f2f2f0
    style OUT_YES fill:#0e2017,stroke:#1d9e75,color:#f2f2f0
    style OUT_NO fill:#1a1212,stroke:#d85a30,color:#f2f2f0
```

---

## Setup

```bash
git clone https://github.com/<your-username>/aura-ai.git
cd aura-ai
npm install
cp .env.example .env
```

> **Requires a CoinMarketCap API key and a Gemini API key to run.** Get a CMC key at [coinmarketcap.com/api](https://coinmarketcap.com/api/), and a Gemini key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey). Paste both into `.env`. Never commit this file.

```env
CMC_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

```bash
npm run dev
```

---

## Sample output

```json
{
  "active_narrative": "RWA",
  "recommendation": "rotate 20% into ONDO",
  "confidence_score": 78,
  "reasoning": "Institutional RWA inflows on BNB Chain rose $80M this week."
}
```

---

