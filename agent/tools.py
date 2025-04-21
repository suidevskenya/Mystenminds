from typing import List, Dict, Any
from langchain.tools import BaseTool
from config.config import SUI_KNOWLEDGE_BASE

class GetSuiInfoTool(BaseTool):
    name = "get_sui_info"
    description = "Get general information about the Sui blockchain ecosystem"
    
    def _run(self, query: str = "") -> Dict[str, Any]:
        return SUI_KNOWLEDGE_BASE

class GetSuiResourcesTool(BaseTool):
    name = "get_sui_resources"
    description = "Get links to Sui documentation, explorer, GitHub, and wallet"
    
    def _run(self, query: str = "") -> Dict[str, str]:
        return SUI_KNOWLEDGE_BASE["resources"]

class ExplainSuiConceptTool(BaseTool):
    name = "explain_sui_concept"
    description = "Explain a concept related to Sui blockchain (transactions, objects, Move language, etc.)"
    
    def _run(self, concept: str) -> str:
        concepts = {
            "object": "Sui has an object-centric data model. On Sui, user-defined smart contracts create and manage programmable objects. Objects are instances of Move structs that encapsulate data and behavior.",
            "move": "Move is a programming language designed for secure implementation of custom resource types for blockchain platforms. In Sui, Move is used to define, create and manage programmable Sui objects.",
            "transaction": "Sui transactions directly reference objects to be read or written, specifying the exact effects of the transaction. This enables parallel execution of transactions that don't access the same objects.",
            "gas": "Sui uses a storage fund and smart pricing strategy to maintain low gas fees even during high network usage periods.",
            "staking": "Sui allows users to delegate their tokens to validators for staking rewards, helping secure the network.",
            "consensus": "Sui uses a Byzantine Fault Tolerant consensus mechanism called Narwhal and Bullshark for high throughput."
        }
        
        concept = concept.lower()
        if concept in concepts:
            return concepts[concept]
        else:
            return f"I don't have specific information about '{concept}' in Sui. Please refer to the official Sui documentation for more details."
