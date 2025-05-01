from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from agent.sui_agent import SuiAgent

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
agent = SuiAgent()

# Add CORS middleware to allow requests from frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://0.0.0.0:8000", "http://localhost:8000", "http://localhost:3000"],
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

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    if not user_message:
        return JSONResponse({"error": "No message provided"}, status_code=400)
    response = await agent.process_query(user_message)
    return JSONResponse({"answer": response})

if __name__ == "__main__":
    uvicorn.run("webserver:app", host="0.0.0.0", port=8000, reload=True)
