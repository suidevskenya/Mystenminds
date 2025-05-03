from typing import Dict, List, Any, Optional
import asyncio
import json
from pysui.sui.sui_clients.sync_client import SuiClient as SyncSuiClient
from pysui.sui.sui_clients.async_client import SuiClient as AsyncSuiClient
from pysui.sui.sui_builders.get_builders import GetObjectsOwnedByAddress, GetTx
from pysui.sui.sui_builders.subscription_builders import SubscribeEvent
from pysui.sui.sui_builders.exec_builders import (
    _MoveCallTransactionBuilder as ProgrammableTransactionBuilder,
    _MoveCallTransactionBuilder as TransactionBuilder,
)
from pysui.sui.sui_types.address import SuiAddress
from pysui.sui.sui_types.scalars import SuiString, SuiU64
from pysui.sui.sui_clients.sync_client import SuiClient
from pysui.sui.sui_config import SuiConfig
from config.config import SUI_RPC_ENDPOINT, SUI_WEBSOCKET_ENDPOINT

class SuiConnector:
    """Connector for interacting with the Sui blockchain via RPC"""
    
    def __init__(self):
        """Initialize Sui client connection"""
        # Create Sui config with the RPC endpoint
        self.config = SuiConfig.user_config(rpc_url=SUI_RPC_ENDPOINT)
        # Initialize sync client for regular RPC calls
        self.client = SyncSuiClient(self.config)
        # Initialize async client for subscriptions
        self.async_client = AsyncSuiClient(self.config)
        
    def get_object(self, object_id: str) -> Dict[str, Any]:
        """Get details of a Sui object by ID"""
        try:
            result = self.client.execute(
                GetObjectsOwnedByAddress().object_ids([object_id]).build()
            )
            if result.is_ok():
                return result.result_data[0].data
            return {"error": "Object not found or inaccessible"}
        except Exception as e:
            return {"error": str(e)}
    
    def get_latest_transactions(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Get latest transactions from the Sui blockchain"""
        try:
            # Sui doesn't have a direct "get latest transactions" endpoint, so we'll need to 
            # use the available pagination methods from the SDK
            result = self.client.execute(
                GetTx().limit(limit).descending_order().build()
            )
            if result.is_ok():
                return result.result_data
            return [{"error": "Failed to retrieve transactions"}]
        except Exception as e:
            return [{"error": str(e)}]

    def get_transactions_by_address(self, address: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent transactions related to a specific wallet address"""
        try:
            # This is a placeholder implementation; adjust based on actual SDK capabilities
            # For example, use GetObjectsOwnedByAddress to get objects, then get transactions involving those objects
            owned_objects_result = self.client.execute(
                GetObjectsOwnedByAddress().address(address).build()
            )
            if not owned_objects_result.is_ok():
                return [{"error": "Failed to retrieve owned objects"}]

            object_ids = [obj.object_id for obj in owned_objects_result.result_data]
            transactions = []
            for obj_id in object_ids:
                tx_result = self.client.execute(
                    GetTx().object_id(obj_id).limit(limit).descending_order().build()
                )
                if tx_result.is_ok():
                    transactions.extend(tx_result.result_data)
                if len(transactions) >= limit:
                    break
            return transactions[:limit]
        except Exception as e:
            return [{"error": str(e)}]
    
    def get_coin_balance(self, address: str, coin_type: str = "0x2::sui::SUI") -> Dict[str, Any]:
        """Get coin balance for an address"""
        try:
            # PySui doesn't have a direct method for coin balance, so we'll need to use the available methods
            balance = self.client.config.client.sui_client.get_coin_balances_owned_by_address(
                address=address, 
                coin_type=coin_type
            )
            
            total_balance = 0
            for entry in balance:
                total_balance += int(entry["balance"])
                
            return {
                "address": address,
                "coin_type": coin_type,
                "balance": total_balance,
                "balance_human": total_balance / 10**9,  # Convert from MIST to SUI
                "coin_objects": balance
            }
        except Exception as e:
            return {"error": str(e)}

    def get_balances(self, address: str) -> Dict[str, Any]:
        """Get balances for all coin types owned by an address"""
        try:
            balances = self.client.config.client.sui_client.get_coin_balances_owned_by_address(address=address)
            total_balances = {}
            for entry in balances:
                coin_type = entry.get("coin_type", "unknown")
                balance = int(entry.get("balance", 0))
                total_balances[coin_type] = total_balances.get(coin_type, 0) + balance

            # Convert balances to human-readable format (assuming 9 decimals)
            human_readable = {k: v / 10**9 for k, v in total_balances.items()}

            return {
                "address": address,
                "balances": total_balances,
                "balances_human": human_readable,
                "coin_objects": balances
            }
        except Exception as e:
            return {"error": str(e)}
    
    async def subscribe_to_events(self, event_filter: Dict[str, Any], callback):
        """Subscribe to Sui events using WebSocket"""
        try:
            # Create subscription builder
            subscription = SubscribeEvent().filter(event_filter).build()
            
            # Subscribe to events
            subscription_id = await self.async_client.subscribe_event(
                subscription, callback
            )
            
            return subscription_id
        except Exception as e:
            print(f"Event subscription error: {str(e)}")
            return None
            
    def create_transfer_transaction(self, 
                                   sender: str, 
                                   recipient: str, 
                                   amount: int, 
                                   gas_budget: int = 2000000) -> Dict[str, Any]:
        """Create a transaction to transfer SUI"""
        try:
            # Create transaction builder
            ptb = ProgrammableTransactionBuilder()
            # Add transfer operation
            ptb.transfer_sui(recipient, amount)
            
            # Build the transaction
            txb = TransactionBuilder(self.client.config, 
                                   sender, 
                                   gas_budget=gas_budget)
            txb.add_programmable_transaction(ptb)
            
            # Create the transaction data
            tx_data = self.client.config.client.sui_client.transaction_builder.build_transaction_data(
                txb.get_transaction()
            )
            
            return {
                "tx_bytes": tx_data,
                "sender": sender,
                "status": "ready_for_signature"
            }
        except Exception as e:
            return {"error": str(e)}
    
    def execute_signed_transaction(self, tx_bytes, signature, pub_key) -> Dict[str, Any]:
        """Submit a signed transaction to the network"""
        try:
            # Submit the transaction
            result = self.client.config.client.sui_client.execute_transaction(
                tx_bytes=tx_bytes,
                signature=signature,
                pub_key=pub_key
            )
            
            return result
        except Exception as e:
            return {"error": str(e)}
    
    def get_network_stats(self) -> Dict[str, Any]:
        """Get current network statistics"""
        try:
            # Get latest checkpoint
            checkpoint = self.client.config.client.sui_client.get_latest_checkpoint_sequence_number()
            
            # Get system state
            system_state = self.client.config.client.sui_client.get_sui_system_state()
            
            # Calculate TPS (this is approximate)
            # In a real implementation, you might want to average over multiple checkpoints
            checkpoint_data = self.client.config.client.sui_client.get_checkpoint(checkpoint)
            transactions_count = checkpoint_data.get("transactions_count", 0)
            
            return {
                "latest_checkpoint": checkpoint,
                "epoch": system_state.get("epoch", "unknown"),
                "validators_count": len(system_state.get("validators", {}).get("active_validators", [])),
                "transactions_in_latest_checkpoint": transactions_count,
                "storage_fund_total_object_storage_rebates": system_state.get("storage_fund", {}).get("total_object_storage_rebates", "unknown"),
                "protocol_version": system_state.get("protocol_version", "unknown")
            }
        except Exception as e:
            return {"error": str(e)}

    def get_transactions_from_explorer(self, address: str, limit: int = 10) -> dict:
        """Fetch transaction history for a wallet address from an external block explorer API (e.g., Movescan)"""
        import requests

        try:
            # Example API endpoint for Movescan (replace with actual if different)
            api_url = f"https://api.movescan.io/v1/addresses/{address}/transactions?limit={limit}"

            response = requests.get(api_url, timeout=10)
            response.raise_for_status()
            data = response.json()

            # Parse and return relevant transaction data
            transactions = data.get("data", [])
            return {
                "address": address,
                "transactions": transactions[:limit]
            }
        except requests.RequestException as e:
            return {"error": f"Failed to fetch transactions from explorer: {str(e)}"}
