# 🚀 Quick Start - AI Chat (5 Minutes)

## Get Your AI Chat Running in 5 Minutes!

### Step 1: Get Gemini API Key (2 minutes)

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### Step 2: Configure (1 minute)

```bash
cd ai/
echo "GEMINI_API_KEY=paste_your_key_here" > .env
```

### Step 3: Start AI Service (1 minute)

```bash
./start_gemini.sh
```

Wait for: `🌟 Starting Gemini AI Chat Service...`

### Step 4: Test (1 minute)

Open a new terminal:

```bash
# Test if service is running
curl http://localhost:5001/health

# Test chat
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Suggest a balanced lineup", "session_id": "test"}'
```

### Step 5: Use in Frontend

The chat component is already created! Just import it:

```jsx
import GeminiAIChat from './components/GeminiAIChat';

function App() {
  return (
    <div>
      <h1>Flow Fantasy Fusion</h1>
      <GeminiAIChat />
    </div>
  );
}
```

## ✅ That's It!

Your AI chat is now running on `http://localhost:5001`

## 🎯 Try These Commands

**In the chat interface:**
- "Suggest a balanced lineup for me"
- "Show me high-risk picks"
- "I want safe, consistent players"
- "Which players are trending?"

## 📚 Need More Help?

- **Detailed Setup**: See `ai/GEMINI_SETUP.md`
- **Integration Guide**: See `GEMINI_INTEGRATION.md`
- **Full Summary**: See `AI_CHAT_SUMMARY.md`
- **Run Tests**: `python ai/test_gemini.py`

## 🐛 Troubleshooting

**Service won't start?**
```bash
cd ai/
pip install -r requirements.txt
python gemini_app.py
```

**API key error?**
```bash
# Check if .env exists
cat .env

# Should show: GEMINI_API_KEY=AIza...
```

**Frontend can't connect?**
- Make sure service is running on port 5001
- Check browser console for errors
- Verify CORS is enabled

## 🎉 You're Ready!

Your AI chat assistant is now live and ready to help users build winning lineups!
