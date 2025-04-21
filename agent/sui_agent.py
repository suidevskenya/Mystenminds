from typing import List
import google.generativeai as genai
from langchain.agents import AgentExecutor, create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import BaseTool
from langchain.prompts import PromptTemplate

from agent.tools import GetSuiInfoTool, GetSuiResourcesTool, ExplainSuiConceptTool
from config.config import GEMINI_API_KEY, GEMINI_MODEL, AGENT_NAME, AGENT_GREETING

class SuiAgent:
    def __init__(self):
        # Configure Google Gemini API
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Initialize LLM
        self.llm = ChatGoogleGenerativeAI(
            model=GEMINI_MODEL,
            google_api_key=GEMINI_API_KEY,
            temperature=0.3
        )
        
        # Initialize tools
        self.tools = [
            GetSuiInfoTool(),
            GetSuiResourcesTool(),
            ExplainSuiConceptTool()
        ]
        
        # Create agent prompt
        self.prompt = PromptTemplate.from_template(
            """You are MystenMinds, an AI assistant that helps users navigate and understand the Sui blockchain ecosystem.
            Always introduce yourself as MystenMinds at the beginning of each new conversation.
            Be helpful, friendly, and knowledgeable about Sui blockchain technology.
            
            {chat_history}
            
            Human: {input}
            
            Use the available tools to provide accurate information about Sui blockchain.
            
            {agent_scratchpad}"""
        )
        
        # Create agent
        self.agent = create_react_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=self.prompt
        )
        
        # Create agent executor
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            verbose=True,
            handle_parsing_errors=True
        )
        
        # Agent name and greeting
        self.name = AGENT_NAME
        self.greeting = AGENT_GREETING
    
    def get_greeting(self):
        """Return the agent's greeting message"""
        return self.greeting
    
    async def process_query(self, query: str, is_first_interaction=False):
        """Process a user query and return a response"""
        try:
            # If this is the first interaction, prepend the greeting
            if is_first_interaction:
                response = await self.agent_executor.ainvoke({"input": query})
                return f"{self.greeting}\n\n{response['output']}"
            else:
                response = await self.agent_executor.ainvoke({"input": query})
                return response["output"]
        except Exception as e:
            return f"Error processing your query: {str(e)}"
