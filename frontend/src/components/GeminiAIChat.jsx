import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, Shield, Zap, RefreshCw } from 'lucide-react';
import './GeminiAIChat.css';

const GeminiAIChat = () => {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: "👋 Hi! I'm your AI Fantasy Sports Assistant powered by Google Gemini. I can help you build winning lineups, analyze players, and develop strategies. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session-${Math.random().toString(36).substr(2, 9)}`);
  const [lineupData, setLineupData] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    { icon: <Sparkles size={16} />, text: "Suggest a balanced lineup", color: "#3b82f6" },
    { icon: <Zap size={16} />, text: "Show me high-risk picks", color: "#ef4444" },
    { icon: <Shield size={16} />, text: "Give me safe, consistent players", color: "#10b981" },
    { icon: <TrendingUp size={16} />, text: "Which players are trending?", color: "#f59e0b" }
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      sender: 'user', 
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          session_id: sessionId,
          context: {
            league_info: { id: 1, name: "Current League" }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: data.response,
          timestamp: new Date(),
          isLineupSuggestion: data.is_lineup_suggestion
        }
      ]);

      // Store lineup data if available
      if (data.lineup_data) {
        setLineupData(data.lineup_data);
      }

    } catch (error) {
      console.error('Error calling AI service:', error);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: "⚠️ I'm having trouble connecting to the AI service. Please make sure the Gemini API is configured and the service is running.",
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInput(promptText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetConversation = async () => {
    try {
      await fetch(`http://localhost:5001/api/reset?session_id=${sessionId}`, {
        method: 'POST'
      });
      setMessages([
        { 
          sender: 'ai', 
          text: "Conversation reset! How can I help you with your fantasy lineup today?",
          timestamp: new Date()
        }
      ]);
      setLineupData(null);
    } catch (error) {
      console.error('Error resetting conversation:', error);
    }
  };

  return (
    <div className="gemini-chat-container">
      <div className="chat-header">
        <div className="header-content">
          <div className="header-title">
            <Sparkles className="sparkle-icon" />
            <h2>Fantasy AI Assistant</h2>
          </div>
          <p className="header-subtitle">Powered by Google Gemini</p>
        </div>
        <button onClick={resetConversation} className="reset-btn" title="Reset conversation">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-content">
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {lineupData && (
        <div className="lineup-preview">
          <h3>📋 Suggested Lineup</h3>
          <div className="lineup-stats">
            <div className="stat">
              <span className="stat-label">Expected Score:</span>
              <span className="stat-value">{lineupData.expected_score.toFixed(1)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Risk Level:</span>
              <span className={`stat-value risk-${lineupData.risk_level.toLowerCase()}`}>
                {lineupData.risk_level}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Confidence:</span>
              <span className="stat-value">{(lineupData.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="lineup-players">
            {lineupData.players.slice(0, 5).map((player, idx) => (
              <div key={idx} className="player-card">
                <span className="player-position">{player.position}</span>
                <span className="player-name">{player.name}</span>
                <span className="player-score">{player.recent_performance.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quick-prompts">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleQuickPrompt(prompt.text)}
            className="quick-prompt-btn"
            style={{ borderColor: prompt.color }}
            disabled={isLoading}
          >
            <span style={{ color: prompt.color }}>{prompt.icon}</span>
            <span>{prompt.text}</span>
          </button>
        ))}
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="Ask me about lineup suggestions, player stats, or strategy..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
          disabled={isLoading}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default GeminiAIChat;
