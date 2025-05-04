'use client'

import React, { useState } from "react";

export default function AskMystenMinds() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

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

  const exampleQueries = [
    "How do I create a Move smart contract on SUI?",
    "What are SUI's transaction fees compared to Solana?",
    "Explain SUI's object-centric model",
    "How does SUI achieve horizontal scalability?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900 text-white flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-semibold mb-6 text-center">Ask MystenMinds</h2>

      <form onSubmit={handleSubmit} className="mb-6 w-full max-w-3xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., How does SUI's consensus mechanism work?"
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
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
        <div className="bg-white/20 p-4 rounded-lg animate-fade-in max-w-3xl w-full">
          <h3 className="font-medium mb-2">Response:</h3>
          <p className="text-black">{response}</p>
        </div>
      )}

      <div className="mt-6 max-w-3xl w-full">
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
    </div>
  );
}
