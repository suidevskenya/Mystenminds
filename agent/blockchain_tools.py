from typing import Dict, List, Any, Optional
from langchain.tools import BaseTool
from agent.sui_connector import SuiConnector
from typing import Optional

class GetObjectTool(BaseTool):
    name: str = "get_object_info"
    description: str = "Get information about a Sui object by its ID"
    sui_connector: Optional[SuiConnector] = None
    
    def __init__(self):
        super().__init__()
        if self.sui_connector is None:
            self.sui_connector = SuiConnector()
    
    def _run(self, object_id: str) -> Dict[str, Any]:
        """Get object data from Sui blockchain"""
        if not object_id or not isinstance(object_id, str):
            return {"error": "Invalid object ID. Please provide a valid Sui object ID."}
        
        return self.sui_connector.get_object(object_id)

class GetTransactionsTool(BaseTool):
    name: str = "get_latest_transactions"
    description: str = "Get the latest transactions from the Sui blockchain"
    sui_connector: Optional[SuiConnector] = None
    
    def __init__(self):
        super().__init__()
        if self.sui_connector is None:
            self.sui_connector = SuiConnector()
    
    def _run(self, limit: str = "5") -> List[Dict[str, Any]]:
        """Get latest transactions"""
        try:
            limit_int = int(limit)
            if limit_int <= 0 or limit_int > 50:
                limit_int = 5  # Default to 5 if invalid
        except ValueError:
            limit_int = 5  # Default to 5 if not a number
            
        return self.sui_connector.get_latest_transactions(limit_int)

class GetAccountBalanceTool(BaseTool):
    name: str = "get_account_balance"
    description: str = "Check the balance of a Sui address"
    sui_connector: Optional[SuiConnector] = None
    
    def __init__(self):
        super().__init__()
        if self.sui_connector is None:
            self.sui_connector = SuiConnector()
    
    def _run(self, args: str) -> Dict[str, Any]:
        """Get account balance for a Sui address"""
        # Parse the input - expect 'address' or 'address,coin_type'
        parts = args.split(',')
        address = parts[0].strip()
        
        coin_type = "0x2::sui::SUI"  # Default to SUI token
        if len(parts) > 1:
            coin_type = parts[1].strip()
            
        if not address:
            return {"error": "Address not provided. Please provide a valid Sui address."}
            
        return self.sui_connector.get_coin_balance(address, coin_type)

class GetNetworkStatsTool(BaseTool):
    name: str = "get_network_stats"
    description: str = "Get current statistics about the Sui network"
    sui_connector: Optional[SuiConnector] = None
    
    def __init__(self):
        super().__init__()
        if self.sui_connector is None:
            self.sui_connector = SuiConnector()
    
    def _run(self, _="") -> Dict[str, Any]:
        """Get current Sui network statistics"""
        return self.sui_connector.get_network_stats()

class CreateTransferTool(BaseTool):
    name:str = "create_transfer_transaction"
    description :str = "Create an unsigned transaction to transfer SUI tokens (amount in MIST, 1 SUI = 10^9 MIST)"
    sui_connector: Optional[SuiConnector] = None
    
    def __init__(self):
        super().__init__()
        if self.sui_connector is None:
            self.sui_connector = SuiConnector()
    
    def _run(self, args: str) -> Dict[str, Any]:
        """Create a transaction to transfer SUI tokens"""
        try:
            # Parse arguments: sender,recipient,amount[,gas_budget]
            parts = args.split(',')
            if len(parts) < 3:
                return {"error": "Not enough parameters. Format: sender,recipient,amount[,gas_budget]"}
                
            sender = parts[0].strip()
            recipient = parts[1].strip()
            
            try:
                amount = int(parts[2].strip())
            except ValueError:
                return {"error": "Amount must be an integer (in MIST units)"}
                
            gas_budget = 2000000  # Default gas budget
            if len(parts) > 3:
                try:
                    gas_budget = int(parts[3].strip())
                except ValueError:
                    return {"error": "Gas budget must be an integer"}
            
            return self.sui_connector.create_transfer_transaction(
                sender=sender,
                recipient=recipient,
                amount=amount,
                gas_budget=gas_budget
            )
        except Exception as e:
            return {"error": f"Failed to create transaction: {str(e)}"}