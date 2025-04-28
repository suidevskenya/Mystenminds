# MystenMinds Integration Guide

This project consists of two main parts:

1. **Frontend:** The Next.js app located in the `mysten-minds/` folder.
2. **Backend & Agent:** The FastAPI backend and AI agent located in the root folder and `agent/` folder.

## Overview

- The frontend (`mysten-minds`) communicates with the backend API server.
- The backend (`main.py`) runs a FastAPI server that exposes endpoints to interact with the AI agent (`agent/sui_agent.py`).
- The AI agent processes queries about the SUI blockchain ecosystem using LangChain and Google Gemini.

## Running the Project

### 1. Start the Backend API Server

Make sure you have Python dependencies installed (e.g., FastAPI, uvicorn, LangChain, etc.).

Run the backend server with:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

This will start the FastAPI server on `http://localhost:8000`.

### 2. Start the Frontend Next.js App

Navigate to the `mysten-minds` folder:

```bash
cd mysten-minds
npm install
npm run dev
```

This will start the Next.js development server on `http://localhost:3000`.

### 3. Using the Application

- Open your browser at `http://localhost:3000`.
- Use the interface to ask questions about the SUI ecosystem.
- The frontend will send queries to the backend API at `http://localhost:8000/query`.
- The backend will process the queries using the AI agent and return responses.

## Optional Improvements

- You can add environment variables in the frontend to configure the backend API URL.
- You can create a script or use tools like `concurrently` to run both frontend and backend with a single command.
- Enhance error handling and session management as needed.

## Summary

This setup provides a seamless integration between the Next.js frontend and the Python AI agent backend via FastAPI.

For any questions or issues, please refer to the code or contact the maintainers.
