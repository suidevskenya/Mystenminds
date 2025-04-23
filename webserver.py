from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import asyncio

from agent.sui_agent import SuiAgent

app = FastAPI()
agent = SuiAgent()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("static/index.html", "r") as f:
        return f.read()

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    if not user_message:
        return JSONResponse({"error": "No message provided"}, status_code=400)
    response = await agent.process_query(user_message)
    return JSONResponse({"response": response})

if __name__ == "__main__":
    uvicorn.run("webserver:app", host="0.0.0.0", port=8000, reload=True)
