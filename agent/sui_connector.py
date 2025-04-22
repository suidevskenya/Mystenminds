# agent/sui_connector.py
from typing import Dict, List, Any, Optional
import asyncio
import json
from pysui.sui.client import SuiClient
from pysui.sui.sui_builders.get_builders import GetObjectsBuilder, GetTransactionBuilder
from pysui.sui.sui_builders.subscription_builders import SubscribeEventBuilder
from pysui.sui.sui_builders.transaction_builders import (
    ProgrammableTransactionBuilder, TransactionBuilder
)
from pysui.sui.sui_types.address import SuiAddress
from pysui.sui.sui_types.scalars import SuiString, SuiU64
from pysui.sui.sui_clients.sync_client import SuiSyncClient
from pysui.sui.sui_config import SuiConfig
from config.config import SUI_RPC_ENDPOINT, SUI_WEBSOCKET_ENDPOINT

class SuiConnector:
    """Connector for interacting with the Sui blockchain via RPC"""
    
    def __init__(self):
        """Initialize Sui client connection"""
        # Create Sui config with the RPC endpoint
        self.config = SuiConfig.user_config(rpc_url=SUI_RPC_ENDPOINT)
        # Initialize sync client for regular RPC calls
        self.client = SuiSyncClient(self.config)
        # Initialize async client for subscriptions
        self.async_client = SuiClient(self.config)
        
    def get_object(self, object_id: str) -> Dict[str, Any]:
        """Get details of a Sui object by ID"""
        try:
            result = self.client.execute(
                GetObjectsBuilder().object_ids([object_id]).build()
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
                GetTransactionBuilder().limit(limit).descending_order().build()
            )
            if result.is_ok():
                return result.result_data
            return [{"error": "Failed to retrieve transactions"}]
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
    
    async def subscribe_to_events(self, event_filter: Dict[str, Any], callback):
        """Subscribe to Sui events using WebSocket"""
        try:
            # Create subscription builder
            subscription = SubscribeEventBuilder().filter(event_filter).build()
            
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