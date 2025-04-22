from typing import List
import google.generativeai as genai
from langchain.agents import AgentExecutor, create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import BaseTool
from langchain.prompts import PromptTemplate
from langchain import hub

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
        
        # Get the standard ReAct prompt from LangChain hub
        self.prompt = hub.pull("hwchase17/react")
        
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
            handle_parsing_errors=True,
            max_iterations=5  # Prevent infinite loops
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
                response = await self.agent_executor.ainvoke({
                    "input": f"{self.greeting}\n\nUser question: {query}",
                    "chat_history": []
                })
                return response['output']
            else:
                response = await self.agent_executor.ainvoke({
                    "input": query,
                    "chat_history": []
                })
                return response['output']
        except Exception as e:
            return f"Error processing your query: {str(e)}. Please try again."