from langchain.tools import BaseTool
import os

class TelegramGroupsTool(BaseTool):
    name: str = "telegram_groups"
    description: str = "List popular Telegram groups related to the Sui blockchain ecosystem."

    def _run(self, query: str) -> str:
        api_key = os.getenv("TELEGRAM_API_KEY")
        if not api_key:
            return "Telegram API key is not configured. Please set TELEGRAM_API_KEY in the environment."
        try:
            
            groups = [
                "Sui Blockchain Official - https://t.me/suiblockchain",
                "Sui Developers - https://t.me/suidevelopers",
                "Sui NFT Collectors - https://t.me/suinftcollectors",
                "Sui Gaming Community - https://t.me/suigaming"
            ]
            return "Popular Sui Telegram groups:\n" + "\n".join(groups)
        except Exception as e:
            return f"Error fetching Telegram groups: {str(e)}"

    async def _arun(self, query: str) -> str:
        return self._run(query)
