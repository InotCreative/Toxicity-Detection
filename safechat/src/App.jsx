import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import toxicityDetector from './utils/toxicityDetector';

// Mock data for example responses
const BOT_RESPONSES = [
  "Hi there! How can I help you today?",
  "That's interesting. Tell me more.",
  "I understand how you feel.",
  "Could you elaborate on that?",
  "Thanks for sharing your thoughts.",
  "I appreciate your perspective.",
  "What else is on your mind?",
  "Let's discuss this further.",
  "I'm here to listen and help.",
  "That's a great point!"
];

const App = () => {
  const [messages, setMessages] = useState([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    // Check if the toxicity model is loaded
    const checkModelStatus = async () => {
      try {
        await toxicityDetector.loadModel();
        setModelLoaded(true);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    checkModelStatus();

    // Add welcome message
    setMessages([
      {
        id: uuidv4(),
        text: "Welcome to SafeChat! This app uses TensorFlow.js to detect and filter toxic messages in real-time. Try typing something to see the toxicity analyzer in action.",
        sender: 'system',
        timestamp: new Date(),
        isToxic: false
      }
    ]);
  }, []);

  const handleSendMessage = async (text, toxicityResult) => {
    const { isToxic, toxicityScore } = toxicityResult;
    
    // Add user message
    const userMessage = {
      id: uuidv4(),
      text,
      sender: 'me',
      timestamp: new Date(),
      isToxic,
      toxicityScore
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot response
    setTimeout(async () => {
      // Get random response
      const botText = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      
      const botMessage = {
        id: uuidv4(),
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
        isToxic: false,
        toxicityScore: 0
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title">
          <span className="shield-icon">🛡️</span> 
          SafeChat: Real-time Toxicity Detection
        </div>
        <div className="user-info">
          <input
            type="text"
            className="username-input"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </header>
      
      <div className="chat-container">
        {!modelLoaded && (
          <div className="model-loading">
            Loading TensorFlow toxicity model... This may take a moment.
          </div>
        )}
        
        <MessageList messages={messages} />
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          modelLoaded={modelLoaded}
        />
      </div>
    </div>
  );
};

export default App;