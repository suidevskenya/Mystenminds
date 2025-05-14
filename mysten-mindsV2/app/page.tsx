"use client"

import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handleAskQuestion = () => {
    window.location.href = '/ask-mystenminds';
  };
  
  // Handle swipe up gesture
  useEffect(() => {
    if (touchStart - touchEnd > 100) { // Swipe up threshold
      handleAskQuestion();
    }
  }, [touchEnd]);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };
  
  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientY);
  };
  
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-indigo-900 text-white p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Your AI Guide to the SUI Ecosystem
        </h1>
        
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Get instant answers to all your questions about SUI blockchain, Move
          programming, and the entire Mysten Labs ecosystem.
        </p>
        
        <div className="mb-12 animate-bounce">
          {/* Robot illustration */}
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-white rounded-full flex items-center justify-center mb-2">
            <div className="relative">
              {/* Antenna */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-yellow-400"></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-yellow-400"></div>
              
              {/* Eyes */}
              <div className="flex space-x-4 mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              </div>
              
              {/* Mouth */}
              <div className="w-8 h-1 bg-gray-600 mx-auto"></div>
            </div>
          </div>
          
          {/* Robot body */}
          <div className="w-20 h-24 md:w-24 md:h-28 bg-white rounded-xl mx-auto flex flex-col justify-between p-2">
            {/* Control panel */}
            <div className="bg-blue-500 rounded-lg p-1 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Bottom lights */}
            <div className="flex justify-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform ${
            isHovered ? 'scale-105' : ''
          } shadow-lg`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleAskQuestion}
        >
          ASK A QUESTION
        </button>
        
        <p className="text-sm mt-4 text-blue-200">
          Swipe up to ask a question
        </p>
      </div>
    </div>
  );
}