'use client';

import { useWallets } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";

export default function NoSSRWallet() {
  const [isClient, setIsClient] = useState(false);
  const wallet = useWallets();
  const connectedWallet = wallet[0];
  const address = connectedWallet?.accounts[0]?.address;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const shortenAddress = (address: string) => {
    if (!address || address.length <= 10) return address || '';
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return connectedWallet && address ? (
    <div className="mb-8 bg-white/10 p-4 rounded-lg max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm opacity-70">Connected Wallet</span>
          <p className="font-mono">{shortenAddress(address)}</p>
        </div>
        <div className="bg-green-500 rounded-full w-3 h-3"></div>
      </div>
    </div>
  ) : (
    <p className="text-center">No wallet connected</p>
  );
}