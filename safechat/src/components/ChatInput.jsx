import React, { useState, useEffect } from 'react';
import ToxicityIndicator from './ToxicityIndicator';
import toxicityDetector from '../utils/toxicityDetector';

const ChatInput = ({ onSendMessage, modelLoaded }) => {
  const [message, setMessage] = useState('');
  const [toxicityScore, setToxicityScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    // Debounce the toxicity analysis to improve performance
    const analyzeToxicity = async () => {
      if (message.trim() && modelLoaded) {
        setIsAnalyzing(true);
        const result = await toxicityDetector.analyzeToxicityRealTime(message);
        setToxicityScore(result.toxicityScore);
        setIsAnalyzing(false);
      } else {
        setToxicityScore(0);
      }
    };

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Only analyze if there's content and model is loaded
    if (message.trim() && modelLoaded) {
      const timeout = setTimeout(analyzeToxicity, 500);
      setTypingTimeout(timeout);
    } else {
      setToxicityScore(0);
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [message, modelLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Do full toxicity analysis before sending
    const toxicityResult = await toxicityDetector.detectToxicity(message);
    
    onSendMessage(message, toxicityResult);
    setMessage('');
    setToxicityScore(0);
  };

  return (
    <div className="input-container">
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!modelLoaded}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim() || !modelLoaded}
        >
          Send
        </button>
      </form>
      {message.trim() && <ToxicityIndicator toxicityScore={toxicityScore} />}
      {isAnalyzing && (
        <div className="typing-indicator">Analyzing message...</div>
      )}
    </div>
  );
};

export default ChatInput;