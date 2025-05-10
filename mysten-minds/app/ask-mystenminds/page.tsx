'use client'

import React, { useState } from "react";

export default function AskMystenMinds() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleEventsDropdown = () => {
    setIsEventsDropdownOpen((prev) => !prev);
  };

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
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900 text-white flex flex-col p-6 sm:p-8 md:p-10 lg:p-12">
      {/* Header with icons */}
      <header className="relative flex flex-col sm:flex-row justify-between items-center mb-8 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl w-full mx-auto">
        {/* Dropdown icon on left far side */}
        <button
          aria-label="Toggle dropdown"
          onClick={toggleDropdown}
          className="text-white hover:text-blue-300 focus:outline-none mb-4 sm:mb-0 relative z-20"
        >
          {/* Simple hamburger menu icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute top-12 left-0 bg-gradient-to-b from-indigo-900 to-blue-900 text-white rounded-lg shadow-lg w-48 z-10">
            <ul className="py-2">
              <li
                className="px-4 py-2 hover:bg-blue-600 cursor-pointer relative"
                onClick={toggleEventsDropdown}
              >
                Events
                {/* Nested dropdown arrow */}
                <span className="ml-2 inline-block transform transition-transform duration-200" style={{ transform: isEventsDropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  ▶
                </span>
                {/* Nested dropdown */}
                {isEventsDropdownOpen && (
                  <ul className="absolute top-0 left-full mt-0 ml-1 bg-blue-600 rounded-lg shadow-lg w-40 z-20">
                    <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer">Hackathons</li>
                    <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer">Bootcamps</li>
                    <li className="px-4 py-2 hover:bg-blue-700 cursor-pointer">Gaming</li>
                  </ul>
                )}
              </li>
              <li className="px-4 py-2 hover:bg-blue-600 cursor-pointer">Projects</li>
              <li className="px-4 py-2 hover:bg-blue-600 cursor-pointer">Communities</li>
              <li className="px-4 py-2 hover:bg-blue-600 cursor-pointer">Spaces</li>
            </ul>
          </div>
        )}
 
        {/* Right side icons */}
        <div className="flex items-center space-x-6">
          {/* User info icon */}
          <button
            aria-label="User info"
            className="text-white hover:text-blue-300 focus:outline-none"
          >
            {/* User icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
 
          {/* User's query history icon */}
          <button
            aria-label="Query history"
            className="text-white hover:text-blue-300 focus:outline-none"
          >
            {/* History icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
            </svg>
          </button>
        </div>
      </header>

      <h2 className="text-3xl font-semibold mb-6 text-center max-w-3xl w-full mx-auto">Ask MystenMinds</h2>

      <form onSubmit={handleSubmit} className="mb-6 w-full max-w-3xl mx-auto">
        <div className="flex gap-2">
          <textarea
            rows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., How does SUI's consensus mechanism work?"
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 h-10 w-15 justify-center flex items-center m-auto"
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </form>

      {response && (
        <div className="bg-white/20 p-4 rounded-lg animate-fade-in max-w-3xl w-full mx-auto">
          <h3 className="font-medium mb-2">Response:</h3>
          <p className="text-black">{response}</p>
        </div>
      )}

      <div className="mt-6 max-w-3xl w-full mx-auto">
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
