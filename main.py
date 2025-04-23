import asyncio
import warnings
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
from agent.sui_agent import SuiAgent
from agent.transaction_helper import TransactionHelper
from fastapi.middleware.cors import CORSMiddleware

# Suppress specific warnings
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic._internal._generate_schema")
warnings.filterwarnings("ignore", category=UserWarning, message="Mixing V1 models and V2 models")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="langchain_community.utilities")

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
tx_helper = TransactionHelper()

class Query(BaseModel):
    text: str
    is_first_interaction: bool = False

class Response(BaseModel):
    answer: str

class TransferRequest(BaseModel):
    sender: str
    recipient: str
    amount: int
    gas_budget: int = 2000000

class SignRequest(BaseModel):
    tx_bytes: str
    private_key_b64: str

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

@app.post("/create_transfer")
async def create_transfer(request: TransferRequest):
    """Create an unsigned transfer transaction"""
    result = tx_helper.create_transfer_transaction(
        sender=request.sender,
        recipient=request.recipient,
        amount=request.amount,
        gas_budget=request.gas_budget
    )
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result

@app.post("/sign_transaction")
async def sign_transaction(request: SignRequest):
    """
    Sign a transaction with a private key
    WARNING: This endpoint is for DEMO PURPOSES ONLY
    Never send your private key to a server in a real application!
    """
    result = tx_helper.sign_transaction_with_key(
        tx_bytes=request.tx_bytes,
        private_key_b64=request.private_key_b64
    )
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result

@app.post("/execute_transaction")
async def execute_transaction(signed_tx: Dict[str, Any]):
    """Execute a signed transaction"""
    result = tx_helper.execute_transaction(signed_tx)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result

@app.get("/transaction_demo")
async def transaction_demo():
    """Get a demo of the transaction flow"""
    return tx_helper.create_sample_transaction_flow()

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