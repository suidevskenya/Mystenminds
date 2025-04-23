import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "models/gemini-1.5-pro"

import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "models/gemini-1.5-pro"
#sui blockchain configs
SUI_RPC_ENDPOINT = os.getenv('SUI_RPC_ENDPOINT','https://fullnode.mainnet.sui.io:443')
SUI_WEBSOCKET_ENDPOINT=os.getenv('SUI_WEBSOCKET_ENDPOINT','wss://fullnode.mainnet.sui.io:443')
SUI_FAUSUI_FAUCET_ENDPOINT = os.getenv("SUI_FAUCET_ENDPOINT", "https://faucet.testnet.sui.io/gas")

# Agent configuration
AGENT_NAME = "MystenMinds"
AGENT_GREETING = "Hello! I'm MystenMinds, your AI assistant for navigating the Sui blockchain ecosystem. How can I help you today?"

# Basic Sui information for the agent's knowledge base
SUI_KNOWLEDGE_BASE = {
    "about": "Sui is a layer-1 blockchain that's designed to enable creators and developers to build experiences for the next billion users in web3.",
    "key_features": [
        "Horizontal scalability",
        "Fast finality",
        "Object-centric architecture",
        "Move programming language",
        "Low gas fees"
    ],
    "resources": {
        "docs": "https://docs.sui.io/",
        "explorer": "https://explorer.sui.io/",
        "github": "https://github.com/MystenLabs/sui",
        "wallet": "https://wallet.sui.io/"
    }
}
