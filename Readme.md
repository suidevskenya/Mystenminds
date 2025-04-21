# MystenMinds: Sui Ecosystem AI Agent

This project implements an AI agent named MystenMinds that helps users navigate and understand the Sui blockchain ecosystem. The agent uses LangChain and the Gemini API to provide informative responses about Sui concepts, resources, and features.

## Features

- Get general information about Sui blockchain
- Access important Sui resources (documentation, explorer, wallet)
- Learn about key Sui concepts like objects, Move programming language, transactions, etc.
- Interact with the agent via API or command line

## Setup

1. Clone the repository
2. Install the requirements:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Usage

### API Server

Run the FastAPI server:

```
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Command Line Interface

Run the command line interface:

```
python main.py
```

## Expanding the Agent

To add more advanced features:

1. Create new tools in `agent/tools.py`
2. Add real-time Sui blockchain data integration
3. Connect to Sui RPC endpoints for live data
4. Implement transaction creation and submission capabilities
5. Add wallet integration features