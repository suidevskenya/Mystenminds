import logging
from typing import List, Dict, Any, Optional
import asyncio
import google.generativeai as genai
from langchain.agents import AgentExecutor, create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import BaseTool
from langchain.prompts import PromptTemplate

# Configure logging
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

import os
from config.config import AGENT_NAME, AGENT_GREETING
from agent.tools import GetSuiInfoTool, GetSuiResourcesTool, ExplainSuiConceptTool
from agent.blockchain_tools import GetObjectTool, GetTransactionsTool, GetAccountBalanceTool, GetNetworkStatsTool, CreateTransferTool
from agent.community_tools import TelegramGroupsTool

class SuiAgent:
    def __init__(self):
        # Load GEMINI_API_KEY and GEMINI_MODEL from environment
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        gemini_model = os.getenv("GEMINI_MODEL", "models/gemini-1.5-pro")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set. Please set it before running the application.")
        
        # Configure Google Gemini API
        genai.configure(api_key=gemini_api_key)
        
        # Initialize LLM
        self.llm = ChatGoogleGenerativeAI(
            model=gemini_model,
            google_api_key=gemini_api_key,
            temperature=0.3,
            max_retries=2,
            delay_between_retries=5
        )
        
        # Initialize tools
        self.tools = self._initialize_tools()
        
        # Create agent prompt (simplified without chat_history)
        self.prompt = PromptTemplate(
            input_variables=["input", "agent_scratchpad", "tool_names"],
            template="""You are MystenMinds, an AI assistant for the Sui blockchain.
            Be helpful, friendly, and technical when needed.
            
            You can help users discover communities around them, such as Twitter Spaces, Telegram groups, Sui events like gaming events and hackathons, Sui projects, NFTs, influencers, and active builders.
            
            Tools: {tools}
            Tool Names: {tool_names}
            
            Format for tool use:
            Thought: Consider if tool needed
            Action: tool_name
            Action Input: tool_input
            Observation: tool_result
            
            Final Answer: your_response
            
            Current input: {input}
            {agent_scratchpad}"""
        )
        
        # Create agent
        self.agent = create_react_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=self.prompt
        )
        
        # Create agent executor with simplified error handling and fallback
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            verbose=False,  # Set to True for debugging
            handle_parsing_errors="Check your input and try again.",
            max_iterations=5
        )
        
        # Agent info
        self.name = AGENT_NAME
        self.greeting = AGENT_GREETING

    def _initialize_tools(self) -> List[BaseTool]:
        """Initialize tools without verbose logging"""
        return [
            GetSuiInfoTool(),
            GetSuiResourcesTool(),
            ExplainSuiConceptTool(),
            GetObjectTool(),
            GetTransactionsTool(),
            GetAccountBalanceTool(),
            GetNetworkStatsTool(),
            CreateTransferTool(),
            TelegramGroupsTool()
        ]

    async def process_query(self, query: str, is_first_interaction: bool = False) -> str:
        """Process queries with clean error handling and fallback"""
        try:
            # Directly handle Telegram groups queries to avoid LLM quota issues
            if "telegram" in query.lower() and "group" in query.lower():
                telegram_tool = next((tool for tool in self.tools if tool.name == "telegram_groups"), None)
                if telegram_tool:
                    return telegram_tool._run(query)
            
            response = await self.agent_executor.ainvoke({
                "input": query,
                "agent_scratchpad": ""
            })
            return response.get("output", "I couldn't generate a response. Please try again.")
        
        except Exception as e:
            logger.warning(f"Primary agent error: {str(e)}. Attempting fallback.")
            # Fallback response or alternative handling
            return "Sorry, I couldn't process that request due to API limits. Please try again later or ask something else."

    def get_greeting(self) -> str:
        """Return greeting without extra logging"""
        return self.greeting
