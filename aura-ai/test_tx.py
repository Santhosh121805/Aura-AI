import os
from dotenv import load_dotenv

load_dotenv()

from backend.executor import execute_strategy_on_chain

spec = {
    "recommendation": "BUY ETH",
    "reasoning": "Good flow",
    "confidence_score": 85
}
brief = "This is a test."

print(execute_strategy_on_chain(spec, brief))
