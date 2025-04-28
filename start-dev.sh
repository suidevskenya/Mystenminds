#!/bin/bash
# Script to run both backend and frontend concurrently

# Run backend
echo "Starting backend server..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &

# Run frontend
echo "Starting frontend server..."
cd mysten-minds
npm run dev
