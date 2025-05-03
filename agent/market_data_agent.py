import requests

class MarketDataAgent:
    """Agent to fetch real-time market data for SUI coin from CoinGecko API"""

    COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price"

    def get_sui_price(self, currency: str = "usd") -> dict:
        """
        Fetch the current price of SUI coin in the specified currency.

        Args:
            currency (str): The fiat currency to get the price in (default is 'usd').

        Returns:
            dict: A dictionary with the price information or error message.
        """
        params = {
            "ids": "sui",
            "vs_currencies": currency
        }
        try:
            response = requests.get(self.COINGECKO_API_URL, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            if "sui" in data and currency in data["sui"]:
                return {
                    "currency": currency,
                    "price": data["sui"][currency]
                }
            else:
                return {"error": "Price data not found in API response"}
        except requests.RequestException as e:
            return {"error": f"API request failed: {str(e)}"}
