"use client"

import { useState, useEffect, SetStateAction } from 'react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // Typing animation states
  const headerText = "Your AI Guide to the SUI Ecosystem";
  const paragraphText = "Get instant answers to all your questions about SUI blockchain, Move programming, and the entire Mysten Labs ecosystem.";
  
  const [displayHeaderText, setDisplayHeaderText] = useState("");
  const [displayParagraphText, setDisplayParagraphText] = useState("");
  const [headerIndex, setHeaderIndex] = useState(0);
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [isHeaderDeleting, setIsHeaderDeleting] = useState(false);
  const [isParagraphDeleting, setIsParagraphDeleting] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);
  
  const handleAskQuestion = () => {
    window.location.href = '/chat';
  };
  
  // Handle swipe up gesture
  useEffect(() => {
    if (touchStart - touchEnd > 100) { // Swipe up threshold
      handleAskQuestion();
    }
  }, [touchEnd]);
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientY);
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.changedTouches[0].clientY);
  };
  
  // Header typing animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isHeaderDeleting && headerIndex < headerText.length) {
        // Typing forward
        setDisplayHeaderText(headerText.slice(0, headerIndex + 1));
        setHeaderIndex(headerIndex + 1);
      } else if (!isHeaderDeleting && headerIndex === headerText.length) {
        // Start paragraph typing after header completes
        if (!showParagraph) {
          setShowParagraph(true);
        }
        // Pause at end before restarting header
        setTimeout(() => {
          setIsHeaderDeleting(true);
        }, 3000);
      } else if (isHeaderDeleting && headerIndex > 0) {
        // Deleting backward
        setDisplayHeaderText(headerText.slice(0, headerIndex - 1));
        setHeaderIndex(headerIndex - 1);
      } else if (isHeaderDeleting && headerIndex === 0) {
        // Reset to start typing again
        setIsHeaderDeleting(false);
        setShowParagraph(false);
        setParagraphIndex(0);
        setDisplayParagraphText("");
        setIsParagraphDeleting(false);
      }
    }, isHeaderDeleting ? 40 : 100);

    return () => clearTimeout(timer);
  }, [headerIndex, isHeaderDeleting, headerText, showParagraph]);
  
  // Paragraph typing animation
  useEffect(() => {
    if (!showParagraph) return;
    
    const timer = setTimeout(() => {
      if (!isParagraphDeleting && paragraphIndex < paragraphText.length) {
        // Typing forward
        setDisplayParagraphText(paragraphText.slice(0, paragraphIndex + 1));
        setParagraphIndex(paragraphIndex + 1);
      } else if (!isParagraphDeleting && paragraphIndex === paragraphText.length) {
        // Pause at end
        setTimeout(() => {
          setIsParagraphDeleting(true);
        }, 2000);
      } else if (isParagraphDeleting && paragraphIndex > 0) {
        // Deleting backward
        setDisplayParagraphText(paragraphText.slice(0, paragraphIndex - 1));
        setParagraphIndex(paragraphIndex - 1);
      } else if (isParagraphDeleting && paragraphIndex === 0) {
        // Reset paragraph
        setIsParagraphDeleting(false);
      }
    }, isParagraphDeleting ? 30 : 60);

    return () => clearTimeout(timer);
  }, [paragraphIndex, isParagraphDeleting, paragraphText, showParagraph]);
  
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-indigo-900 text-white p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-6 h-20 md:h-24 lg:h-28 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {displayHeaderText}
            <span className="animate-pulse text-blue-400 font-bold">|</span>
          </h1>
        </div>
        
        <div className="mb-12 h-16 md:h-20 flex items-center justify-center">
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            {showParagraph && (
              <>
                {displayParagraphText}
                <span className="animate-pulse text-blue-400 font-bold">|</span>
              </>
            )}
          </p>
        </div>
        
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