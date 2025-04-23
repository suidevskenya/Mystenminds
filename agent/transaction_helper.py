from typing import Dict, Any, Optional
import base64
# Removed import of SignedTransaction as it does not exist in pysui package
# from pysui.sui.sui_txresults.signed_transaction import SignedTransaction
from pysui.abstracts import SignatureScheme
from agent.sui_connector import SuiConnector

class TransactionHelper:
    """Helper class for creating and signing Sui transactions"""
    
    def __init__(self):
        self.connector = SuiConnector()
    
    def create_transfer_transaction(self, 
                                   sender: str, 
                                   recipient: str, 
                                   amount: int, 
                                   gas_budget: int = 2000000) -> Dict[str, Any]:
        """Create an unsigned transfer transaction"""
        return self.connector.create_transfer_transaction(
            sender=sender,
            recipient=recipient,
            amount=amount,
            gas_budget=gas_budget
        )
    
    def sign_transaction_with_key(self, 
                                  tx_bytes: str, 
                                  private_key_b64: str) -> Dict[str, Any]:
        """
        Sign a transaction with a private key
        WARNING: This should NEVER be used in production!
        Private keys should never be sent to a server
        This is for EDUCATIONAL PURPOSES ONLY
        """
        try:
            # Decode the private key
            private_key_bytes = base64.b64decode(private_key_b64)
            
            # Load the key
            from pysui.sui.sui_crypto.keypair import SuiKeyPair
            keypair = SuiKeyPair(SignatureScheme.ED25519, private_key_bytes)
            
            # Sign the transaction
            signature = keypair.sign(tx_bytes)
            
            # Create signature parameters
            sig_base64 = base64.b64encode(signature).decode("ascii")
            pub_key_base64 = base64.b64encode(keypair.public()).decode("ascii")
            
            return {
                "tx_bytes": tx_bytes,
                "signature": sig_base64,
                "pub_key": pub_key_base64
            }
        except Exception as e:
            return {"error": f"Signing error: {str(e)}"}
    
    def execute_transaction(self, signed_tx: Dict[str, Any]) -> Dict[str, Any]:
        """Submit a signed transaction to the Sui network"""
        # Extract the transaction components
        tx_bytes = signed_tx.get("tx_bytes")
        signature = signed_tx.get("signature")
        pub_key = signed_tx.get("pub_key")
        
        if not tx_bytes or not signature or not pub_key:
            return {"error": "Missing transaction components"}
            
        return self.connector.execute_signed_transaction(tx_bytes, signature, pub_key)
    
    def generate_wallet_demo(self) -> Dict[str, Any]:
        """
        Generate a demo wallet for testing purposes
        WARNING: This should NEVER be used in production!
        """
        try:
            from pysui.sui.sui_crypto.keypair import SuiKeyPair
            
            # Generate new keypair
            keypair = SuiKeyPair(ED25519_SCHEME)
            
            # Get address
            address = keypair.address()
            
            # Get private key (base64 encoded)
            private_key_b64 = base64.b64encode(keypair.private()).decode("ascii")
            
            return {
                "address": address,
                "private_key_b64": private_key_b64,
                "warning": "This is a DEMO wallet only. NEVER use this in production or with real funds."
            }
        except Exception as e:
            return {"error": f"Wallet generation error: {str(e)}"}
    
    def create_sample_transaction_flow(self) -> Dict[str, Any]:
        """Create a sample transaction flow for demonstration purposes"""
        try:
            # 1. Generate demo wallet
            wallet = self.generate_wallet_demo()
            if "error" in wallet:
                return wallet
                
            sender = wallet["address"]
            private_key = wallet["private_key_b64"]
            
            # 2. Create transaction (this would typically fail in production since the demo wallet has no funds)
            recipient = "0x1111111111111111111111111111111111111111111111111111111111111111"
            tx_data = self.create_transfer_transaction(sender, recipient, 1000000)
            
            # 3. Sign transaction
            signed_tx = self.sign_transaction_with_key(tx_data["tx_bytes"], private_key)
            
            # 4. Return the full flow info (don't execute since demo wallet has no funds)
            return {
                "demo_wallet": wallet,
                "transaction_data": tx_data,
                "signed_transaction": signed_tx,
                "note": "This demonstrates the transaction creation and signing flow. To execute a real transaction, you would need a funded wallet."
            }
        except Exception as e:
            return {"error": f"Sample transaction flow error: {str(e)}"}