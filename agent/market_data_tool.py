from langchain.tools import BaseTool
from agent.market_data_agent import MarketDataAgent
from pydantic import PrivateAttr

class GetMarketDataTool(BaseTool):
    name: str = "get_market_data"
    description: str = "Get real-time market data for SUI coin, including current price in USD."

    _market_data_agent: MarketDataAgent = PrivateAttr()

    def __init__(self, market_data_agent: MarketDataAgent):
        super().__init__()
        self._market_data_agent = market_data_agent

    def _run(self, query: str = "") -> dict:
        # For now, ignore query and just return current SUI price in USD
        return self._market_data_agent.get_sui_price(currency="usd")
