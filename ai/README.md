# Flow Fantasy Fusion - AI Service

## Overview

## 🌟 Features

### Conversational AI Chat
- Natural language understanding with Google Gemini Pro
- Context-aware responses
- Multi-turn conversations with memory
- Explainable AI reasoning

### Lineup Optimization
- Player performance scoring
- Market value analysis (NFT values)
- Consistency metrics
- Trend analysis
- Multiple optimization strategies (balanced, high-risk, conservative)

### Real-time Communication
- RESTful API endpoints
- WebSocket support for instant responses
- Session management
- User preference tracking

## 🚀 Quick Start

### 1. Get Gemini API Key
Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and create an API key.

### 2. Setup
```bash
# Copy environment template
cp .env.example .env

# Add your API key to .env
echo "GEMINI_API_KEY=your_api_key_here" >> .env

# Run the startup script
./start_gemini.sh
```

Or manually:
```bash
# Install dependencies
pip install -r requirements.txt

# Set API key
export GEMINI_API_KEY="your_api_key_here"

# Start the service
python gemini_app.py
```

The service will start on `http://localhost:5001`

## 📡 API Endpoints

### POST /api/chat
Main conversational endpoint

**Request:**
```json
{
  "message": "Suggest a balanced lineup for me",
  "session_id": "user123",
  "context": {
    "league_info": {"id": 1, "name": "NBA Finals League"}
  }
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "user123",
  "response": "Here's a balanced lineup suggestion...",
  "is_lineup_suggestion": true,
  "lineup_data": {
    "players": [...],
    "expected_score": 210.5,
    "risk_level": "Medium",
    "confidence": 0.78,
    "reasoning": "This lineup balances..."
  },
  "timestamp": "2024-11-01T10:30:00"
}
```

### POST /api/preferences
Update user preferences

**Request:**
```json
{
  "session_id": "user123",
  "key": "risk_appetite",
  "value": "aggressive"
}
```

### POST /api/player-info
Get detailed player information

**Request:**
```json
{
  "player_id": 1,
  "session_id": "user123"
}
```

### WebSocket /ws/chat/{session_id}
Real-time chat via WebSocket

```javascript
const ws = new WebSocket('ws://localhost:5001/ws/chat/user123');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('AI Response:', data);
};

ws.send(JSON.stringify({
  message: "Suggest a lineup",
  context: {}
}));
```

### GET /api/quick-suggestions
Get quick suggestion prompts

**Response:**
```json
{
  "suggestions": [
    "Suggest a balanced lineup for me",
    "Show me a high-risk, high-reward lineup",
    "I want a safe, consistent lineup",
    ...
  ]
}
```

## 🧠 AI Capabilities

### Natural Conversations
The AI can understand various ways to ask for help:
- "Suggest a lineup"
- "I need a team for tonight's game"
- "Show me the best players"
- "What's a good strategy?"

### Context Awareness
- Remembers previous messages in the session
- Adapts to user preferences
- Considers budget constraints
- Factors in favorite teams/players

### Strategy Modes

**Balanced (Default)**
- Mix of consistent performers and upside potential
- Moderate risk/reward ratio
- Best for most users

**Conservative**
- Focus on consistent, reliable players
- Lower risk, steady returns
- Ideal for risk-averse users

**Aggressive**
- High-upside players with breakout potential
- Higher risk, higher reward
- For users seeking maximum points

## 🔧 Scoring Algorithm

The AI uses a sophisticated weighted scoring formula:

```
score = α * performance + β * value + γ * consistency + δ * trending
```

Where:
- α = 0.45 (recent performance weight)
- β = 0.30 (NFT market value weight)
- γ = 0.15 (consistency weight)
- δ = 0.10 (trending weight)

## 🎨 Frontend Integration

### React Component
```jsx
import GeminiAIChat from './components/GeminiAIChat';

function App() {
  return (
    <div className="App">
      <GeminiAIChat />
    </div>
  );
}
```

### Install Dependencies
```bash
npm install lucide-react
```

## 📊 Example Conversations

### Getting Started
**User:** "Hi, I need help building a lineup"
```bash
gunicorn --bind 0.0.0.0:5000 app:app
```

## Future Enhancements
- Integration with Find Labs API for real on-chain data
- Dapper Moments API for NBA Top Shot metadata
- Machine learning model training on historical performance
- Real-time injury and trending data feeds
