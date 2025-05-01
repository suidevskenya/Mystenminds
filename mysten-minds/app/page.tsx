'use client'

// Polyfill for crypto.randomUUID if not available
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
  (crypto as { randomUUID?: () => string }).randomUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}

import Head from "next/head";
import { useEffect, useState } from "react";

import { useWallets,ConnectButton } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";

export default function Home() {
  console.log("NEXT_PUBLIC_BACKEND_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const wallet = useWallets();
  const connectedWallet = wallet[0];
  const address = connectedWallet?.accounts[0]?.address;

  const shortenAddress = (address: string) => {
    if (!address || address.length <= 10) return address || '';
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  // Fix for connectedWallet possibly undefined
  useEffect(() => {
    if (!connectedWallet) {
      console.warn('No connected wallet detected');
    }
  }, [connectedWallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query, is_first_interaction: false }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      setResponse(data.answer);
    } catch {
      setResponse('An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connectedWallet) {
      console.log('Connected wallet:', address);
    }
  }, [connectedWallet,address]);

  const exampleQueries = [
    "How do I create a Move smart contract on SUI?",
    "What are SUI's transaction fees compared to Solana?",
    "Explain SUI's object-centric model",
    "How does SUI achieve horizontal scalability?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900 text-white">
      <Head>
        <title>MystenMinds | AI Assistant for SUI Ecosystem</title>
        <meta name="description" content="Your AI assistant for all questions about the SUI blockchain ecosystem" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-2xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold">MystenMinds</h1>
          </div>

          <ConnectButton className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"/>
        </header>

        {connectedWallet && address && (
          <div className="mb-8 bg-white/10 p-4 rounded-lg max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm opacity-70">Connected Wallet</span>
                <p className="font-mono">{shortenAddress(address)}</p>
              </div>
              <div className="bg-green-500 rounded-full w-3 h-3"></div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl font-bold mb-6">Your AI Guide to the SUI Ecosystem</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get instant answers to all your questions about SUI blockchain, Move programming,
            and the entire Mysten Labs ecosystem.
          </p>
          <div className="flex justify-center">
            <a href="#query" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition">
              Ask MystenMinds
            </a>

            {!connectedWallet && (
              <ConnectButton className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition">Connect SUI Wallet</ConnectButton>
            )}

          </div>
        </section>

        {/* Query Interface */}
        <section id="query" className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-center">Ask Me Anything About SUI</h2>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., How does SUI's consensus mechanism work?"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {isLoading ? 'Thinking...' : 'Ask'}
              </button>
            </div>
          </form>

          {response && (
            <div className="bg-white/20 p-4 rounded-lg animate-fade-in">
              <h3 className="font-medium mb-2">Response:</h3>
              <p>{response}</p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-medium mb-2">Try asking:</h3>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(q)}
                  className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="flex items-center">
                <span className="font-bold mr-2">MystenMinds</span>
                <span>© 2025</span>
              </p>
            </div>
            <div>
              <ul className="flex space-x-6">
                <li><a href="#" className="hover:text-blue-300">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-300">Terms</a></li>
                <li><a href="#" className="hover:text-blue-300">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

}
