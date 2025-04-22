import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "models/gemini-1.5-pro"

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
