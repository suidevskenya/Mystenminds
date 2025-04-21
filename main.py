import asyncio
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from agent.sui_agent import SuiAgent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MystenMinds - Sui Ecosystem AI Agent")

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the agent
sui_agent = SuiAgent()

class Query(BaseModel):
    text: str
    is_first_interaction: bool = False

class Response(BaseModel):
    answer: str

@app.get("/")
async def root():
    """Root endpoint that returns the agent's greeting"""
    return {"message": sui_agent.get_greeting()}

@app.post("/query", response_model=Response)
async def process_query(query: Query):
    """Process a user query about the Sui ecosystem"""
    if not query.text.strip():
        raise HTTPException(status_code=400, detail="Query text cannot be empty")
    
    response = await sui_agent.process_query(query.text, query.is_first_interaction)
    return Response(answer=response)

# Session management for CLI to track first interaction
class CLISession:
    def __init__(self):
        self.is_first_interaction = True

# For command line testing
async def main():
    agent = SuiAgent()
    session = CLISession()
    
    print("\n" + "=" * 50)
    print(f"Welcome to {agent.name}")
    print("=" * 50)
    
    # Display greeting message
    print(f"\n{agent.greeting}")
    print("\nType 'exit' to quit")
    print("-" * 50)
    
    while True:
        query = input("\nYou: ")
        if query.lower() == "exit":
            print(f"\nThank you for using {agent.name}. Goodbye!")
            break
        
        response = await agent.process_query(query, session.is_first_interaction)
        
        # After first interaction, set flag to False
        if session.is_first_interaction:
            session.is_first_interaction = False
            
        print(f"\n{agent.name}: {response}")

if __name__ == "__main__":
    import uvicorn
    # To run the API server
    # uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    
    # To run the CLI version
    asyncio.run(main())
