from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from agent.sui_agent import SuiAgent

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
agent = SuiAgent()

frontend_origin = "https://fantastic-lamp-v6w77q4x7p9vhppvj-8000.app.github.dev"

# Remove explicit OPTIONS handler and custom middleware

# Add simple logging middleware to log incoming requests and methods for debugging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins as requested
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import FileResponse

# Serve Next.js static files for /_next only (no /static directory)
app.mount("/_next", StaticFiles(directory="mysten-minds/out/_next"), name="next_static")

from fastapi.responses import FileResponse

# Serve Next.js static files for /_next only (no /static directory)
app.mount("/_next", StaticFiles(directory="mysten-minds/out/_next"), name="next_static")

# Serve favicon.ico directly without redirect
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("mysten-minds/public/favicon.ico")

# Serve index.html at root
@app.get("/", response_class=HTMLResponse)
async def root():
    return FileResponse("mysten-minds/out/index.html")

from fastapi import Response

@app.options("/chat")
async def chat_options():
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
    }
    print("OPTIONS /chat request received")
    return Response(status_code=200, headers=headers)

@app.post("/chat")
async def chat(request: Request):
    """
    POST /chat endpoint to process user messages via SuiAgent.
    Expects JSON payload: {"message": "user input string"}
    Returns JSON response: {"answer": JSON string with final_answer and metadata}
    """
    try:
        data = await request.json()
        user_message = data.get("message", "")
        if not user_message:
            return JSONResponse({"error": "No message provided"}, status_code=400)
        # Log incoming user message
        print(f"Received message from user: {user_message}")
        response = await agent.process_query(user_message)
        # Log agent response
        print(f"Agent response: {response}")
        return JSONResponse({"answer": response})
    except Exception as e:
        print(f"Error processing /chat request: {str(e)}")
        return JSONResponse({"error": "Internal server error"}, status_code=500)

@app.get("/health")
async def health_check():
    """
    Simple health check endpoint to verify the server and agent are running.
    """
    try:
        greeting = agent.get_greeting()
        return JSONResponse({"status": "ok", "agent_name": agent.name, "greeting": greeting})
    except Exception as e:
        print(f"Health check failed: {str(e)}")
        return JSONResponse({"status": "error", "message": "Agent not available"}, status_code=500)

if __name__ == "__main__":
    uvicorn.run("webserver:app", host="0.0.0.0", port=8000, reload=True)
