# 🤖 Gemini AI Integration Guide

## Overview

Your Flow Fantasy Fusion project now includes a **conversational AI assistant** powered by Google Gemini. This provides natural language interaction for lineup suggestions, player analysis, and strategy recommendations.

## 🎯 What's New

### 1. Conversational AI Chat
- Natural language understanding
- Context-aware responses
- Multi-turn conversations with memory
- Explainable AI reasoning

### 2. Enhanced User Experience
- Chat interface for lineup suggestions
- Real-time responses via WebSocket
- Quick action buttons for common requests
- Visual lineup previews with stats

### 3. Smart Features
- **Risk Strategies**: Conservative, Balanced, Aggressive
- **Budget Awareness**: Respects FLOW token budgets
- **Player Analysis**: Detailed stats and recommendations
- **Trend Detection**: Identifies hot and cold players

## 🚀 Getting Started

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure the AI Service

```bash
# Navigate to the ai directory
cd ai/

# Create .env file
cp .env.example .env

# Add your API key (replace with your actual key)
echo "GEMINI_API_KEY=AIzaSy..." > .env
```

### Step 3: Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### Step 4: Start the AI Service

```bash
# Easy way - use the startup script
./start_gemini.sh

# Or manually
python gemini_app.py
```

The service will start on `http://localhost:5001`

### Step 5: Update Frontend

```bash
# Navigate to frontend
cd ../frontend/

# Install new dependencies
npm install lucide-react

# The GeminiAIChat component is already created
# Import it in your App.jsx or desired page
```

## 📁 New Files Created

### AI Service
- `ai/gemini_chat_service.py` - Core Gemini AI logic
- `ai/gemini_app.py` - FastAPI server
- `ai/start_gemini.sh` - Startup script
- `ai/.env.example` - Environment template
- `ai/GEMINI_SETUP.md` - Detailed setup guide

### Frontend
- `frontend/src/components/GeminiAIChat.jsx` - React chat component
- `frontend/src/components/GeminiAIChat.css` - Styling

## 🎨 Using the Chat Component

### Basic Integration

```jsx
// In your App.jsx or any page
import GeminiAIChat from './components/GeminiAIChat';

function LineupPage() {
  return (
    <div className="container">
      <h1>Build Your Lineup</h1>
      <GeminiAIChat />
    </div>
  );
}
```

### With Custom Context

```jsx
import GeminiAIChat from './components/GeminiAIChat';

function LeaguePage({ leagueId, leagueName }) {
  return (
    <div>
      <GeminiAIChat 
        context={{
          league_info: { id: leagueId, name: leagueName }
        }}
      />
    </div>
  );
}
```

## 💬 Example Conversations

### Getting Lineup Suggestions

**User:** "Suggest a balanced lineup for me"

**AI:** "Here's a balanced lineup suggestion for you:

Expected Score: 210.5 points
Risk Level: Medium
Confidence: 78%

Players:
- LeBron James (SF) - 45.2 pts
- Stephen Curry (PG) - 43.8 pts
- Kevin Durant (PF) - 42.1 pts
- Giannis Antetokounmpo (C) - 41.5 pts
- Damian Lillard (SG) - 37.9 pts

This lineup balances star power with consistency. Would you like me to adjust the strategy?"

### Changing Strategy

**User:** "Show me a high-risk, high-reward lineup"

**AI:** "Here's an aggressive lineup with breakout potential:

Expected Score: 245.3 points
Risk Level: High

Players featuring trending players with high upside. These picks could score big but may be inconsistent!"

### Budget Constraints

**User:** "I have a 50 FLOW budget"

**AI:** "I'll keep your budget of 50 FLOW in mind. Here's a cost-effective lineup that maximizes value within your budget..."

## 🔧 API Endpoints

### Chat Endpoint
```bash
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Suggest a balanced lineup",
    "session_id": "user123"
  }'
```

### Update Preferences
```bash
curl -X POST http://localhost:5001/api/preferences \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "user123",
    "key": "risk_appetite",
    "value": "aggressive"
  }'
```

### WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:5001/ws/chat/user123');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('AI Response:', data);
};

ws.send(JSON.stringify({
  message: "Suggest a lineup"
}));
```

## 🎯 Features

### 1. Natural Language Understanding
The AI understands various ways to ask for help:
- "Suggest a lineup"
- "I need a team"
- "Show me the best players"
- "What's a good strategy?"

### 2. Context Awareness
- Remembers conversation history
- Adapts to user preferences
- Considers budget constraints
- Factors in favorite teams

### 3. Strategy Modes

**Balanced (Default)**
- Mix of consistent performers and upside
- Moderate risk/reward
- Best for most users

**Conservative**
- Focus on reliable players
- Lower risk, steady returns
- Ideal for risk-averse users

**Aggressive**
- High-upside players
- Higher risk, higher reward
- For maximum points

### 4. Visual Lineup Preview
- Expected score display
- Risk level indicator
- Confidence percentage
- Player cards with positions and scores

## 🔐 Security

- API key stored in environment variables
- Never commit `.env` file
- Session-based conversations
- Input validation
- CORS configured for frontend

## 🐛 Troubleshooting

### API Key Not Working
```
Error: Gemini API key not configured
```
**Solution:** 
1. Check `.env` file exists in `ai/` directory
2. Verify `GEMINI_API_KEY` is set correctly
3. Restart the service

### Connection Errors
```
Failed to connect to AI service
```
**Solution:**
1. Make sure service is running: `python gemini_app.py`
2. Check port 5001 is not in use
3. Verify firewall settings

### Import Errors
```
ModuleNotFoundError: No module named 'google.generativeai'
```
**Solution:**
```bash
pip install -r requirements.txt
```

## 📊 How It Works

### Architecture

```
User Input → Frontend (React)
    ↓
WebSocket/HTTP → FastAPI Server (gemini_app.py)
    ↓
Gemini Service (gemini_chat_service.py)
    ↓
Google Gemini API
    ↓
AI Response → Frontend → User
```

### Data Flow

1. **User sends message** via chat interface
2. **Frontend** sends to `/api/chat` endpoint
3. **Backend** processes with Gemini AI
4. **AI generates** contextual response
5. **Lineup data** calculated if requested
6. **Response sent** back to frontend
7. **UI updates** with message and lineup preview

## 🚀 Deployment

### Development
```bash
# AI Service
cd ai/
./start_gemini.sh

# Frontend
cd frontend/
npm start
```

### Production

**AI Service:**
```bash
# Use gunicorn or uvicorn
uvicorn gemini_app:app --host 0.0.0.0 --port 5001 --workers 4
```

**Environment Variables:**
```bash
export GEMINI_API_KEY="your_key"
export PORT=5001
```

## 📈 Next Steps

### Immediate
1. ✅ Get Gemini API key
2. ✅ Configure `.env` file
3. ✅ Start AI service
4. ✅ Test chat interface

### Future Enhancements
- [ ] Integrate real player data from APIs
- [ ] Add voice input/output
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Historical performance tracking

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Flow Blockchain Docs](https://developers.flow.com/)

## 🎉 Summary

Your Flow Fantasy Fusion project now has:
- ✅ Conversational AI powered by Gemini
- ✅ Natural language lineup suggestions
- ✅ Real-time chat interface
- ✅ Multiple strategy modes
- ✅ Visual lineup previews
- ✅ WebSocket support
- ✅ Session management

The AI makes your fantasy sports platform more engaging and user-friendly!

---

**Need Help?** Check the detailed setup guide: `ai/GEMINI_SETUP.md`
