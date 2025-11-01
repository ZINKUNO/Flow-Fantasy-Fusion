# Gemini AI Chat Setup Guide

## 🚀 Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Set Up Environment Variables

```bash
# In the ai/ directory
cp .env.example .env

# Edit .env and add your API key
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
```

Or export it directly:
```bash
export GEMINI_API_KEY="your_actual_api_key_here"
```

### 3. Install Dependencies

```bash
# Make sure you're in the ai/ directory
cd ai/

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 4. Run the Gemini AI Service

```bash
# Start the FastAPI server
python gemini_app.py

# Or use uvicorn directly
uvicorn gemini_app:app --reload --port 5001
```

The service will start on `http://localhost:5001`

### 5. Test the API

```bash
# Health check
curl http://localhost:5001/health

# Test chat
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Suggest a balanced lineup for me",
    "session_id": "test123"
  }'
```

## 📡 API Endpoints

### POST /api/chat
Main chat endpoint for conversational AI

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
    "confidence": 0.78
  }
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

## 🎨 Frontend Integration

### Using the React Component

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

### Install Required Frontend Dependencies

```bash
cd frontend/
npm install lucide-react
```

## 🧪 Example Conversations

### Getting Lineup Suggestions
**User:** "Suggest a balanced lineup for me"

**AI:** "Here's a balanced lineup suggestion for you:

Expected Score: 210.5 points
Risk Level: Medium

Players:
- LeBron James (SF) - Score: 45.2
- Stephen Curry (PG) - Score: 43.8
- Kevin Durant (PF) - Score: 42.1
- Giannis Antetokounmpo (C) - Score: 41.5
- Damian Lillard (SG) - Score: 37.9

This lineup balances performance and consistency, with players who have shown steady production. Would you like me to adjust the strategy or show you more options?"

### Changing Strategy
**User:** "Show me a high-risk, high-reward lineup"

**AI:** "Here's an aggressive lineup with breakout potential:

Expected Score: 245.3 points
Risk Level: High

Players:
- Luka Doncic (PG) - Score: 48.5
- Ja Morant (SG) - Score: 46.2
- Zion Williamson (PF) - Score: 44.8
- Anthony Edwards (SF) - Score: 43.1
- Paolo Banchero (C) - Score: 42.7

High-risk lineup featuring players with breakout potential and trending players. These picks could score big but may be inconsistent. The expected upside is 15% higher than the balanced approach!"

### Budget Constraints
**User:** "Help me build a team under 50 FLOW budget"

**AI:** "I'll keep your budget of 50 FLOW in mind. Here's a cost-effective lineup that maximizes value..."

## 🔧 Troubleshooting

### API Key Issues
```
Error: Gemini API key not configured
```
**Solution:** Make sure you've set the `GEMINI_API_KEY` environment variable

### Connection Errors
```
Error: Failed to connect to AI service
```
**Solution:** 
1. Check if the service is running on port 5001
2. Verify CORS is enabled
3. Check firewall settings

### Import Errors
```
ModuleNotFoundError: No module named 'google.generativeai'
```
**Solution:** Install dependencies: `pip install -r requirements.txt`

## 🎯 Features

- ✅ Natural language understanding with Gemini Pro
- ✅ Context-aware responses
- ✅ Multiple lineup strategies (Balanced, Conservative, Aggressive)
- ✅ Real-time chat via WebSocket
- ✅ Session management
- ✅ Player analysis and recommendations
- ✅ Budget-aware suggestions
- ✅ Explainable AI reasoning

## 📊 Performance Tips

1. **Use Session IDs**: Maintain conversation context across requests
2. **WebSocket for Real-time**: Use WebSocket endpoint for instant responses
3. **Cache Player Data**: Store frequently accessed player stats
4. **Rate Limiting**: Implement rate limiting for production use

## 🔐 Security Notes

- Never commit your `.env` file with API keys
- Use environment variables in production
- Implement rate limiting to prevent API abuse
- Validate all user inputs
- Use HTTPS in production

## 📚 Additional Resources

- [Google Gemini Documentation](https://ai.google.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Flow Blockchain Docs](https://developers.flow.com/)

## 🆘 Support

If you encounter issues:
1. Check the logs: `tail -f logs/ai_service.log`
2. Verify API key is valid
3. Test with curl commands
4. Check network connectivity

Happy building! 🚀
