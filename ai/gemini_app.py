"""
Gemini-powered AI Chat API for Flow Fantasy Fusion
FastAPI server with Google Gemini integration
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional, List
import uvicorn
import os
from gemini_chat_service import GeminiFantasyAssistant

app = FastAPI(title="Flow Fantasy Fusion AI Chat")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active chat sessions
chat_sessions: Dict[str, GeminiFantasyAssistant] = {}

# Get Gemini API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if not GEMINI_API_KEY:
    print("⚠️  WARNING: GEMINI_API_KEY not set in environment variables")
    print("Please set it using: export GEMINI_API_KEY='your-api-key'")

class ChatMessage(BaseModel):
    message: str
    session_id: str = "default"
    context: Optional[Dict] = None

class PreferenceUpdate(BaseModel):
    session_id: str = "default"
    key: str
    value: str

class PlayerQuery(BaseModel):
    player_id: int
    session_id: str = "default"

@app.get("/")
async def root():
    return {
        "service": "Flow Fantasy Fusion AI Chat",
        "version": "1.0.0",
        "powered_by": "Google Gemini",
        "status": "active" if GEMINI_API_KEY else "no_api_key"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_configured": bool(GEMINI_API_KEY)
    }

@app.post("/api/chat")
async def chat(chat_message: ChatMessage):
    """
    Main chat endpoint
    
    Example request:
    {
        "message": "Suggest a balanced lineup for me",
        "session_id": "user123",
        "context": {
            "league_info": {"id": 1, "name": "NBA Finals League"}
        }
    }
    """
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=500, 
                detail="Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
            )
        
        session_id = chat_message.session_id
        
        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = GeminiFantasyAssistant(GEMINI_API_KEY)
        
        # Get response from AI
        result = await chat_sessions[session_id].chat(
            chat_message.message,
            chat_message.context
        )
        
        return {
            "success": True,
            "session_id": session_id,
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/preferences")
async def update_preferences(pref: PreferenceUpdate):
    """
    Update user preferences
    
    Example request:
    {
        "session_id": "user123",
        "key": "risk_appetite",
        "value": "aggressive"
    }
    """
    try:
        session_id = pref.session_id
        
        if session_id not in chat_sessions:
            if not GEMINI_API_KEY:
                raise HTTPException(status_code=500, detail="Gemini API key not configured")
            chat_sessions[session_id] = GeminiFantasyAssistant(GEMINI_API_KEY)
        
        success = chat_sessions[session_id].update_preference(pref.key, pref.value)
        
        if success:
            return {
                "success": True,
                "message": f"Preference '{pref.key}' updated to '{pref.value}'"
            }
        else:
            raise HTTPException(status_code=400, detail=f"Invalid preference key: {pref.key}")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/player-info")
async def get_player_info(query: PlayerQuery):
    """
    Get detailed player information
    
    Example request:
    {
        "player_id": 1,
        "session_id": "user123"
    }
    """
    try:
        session_id = query.session_id
        
        if session_id not in chat_sessions:
            if not GEMINI_API_KEY:
                raise HTTPException(status_code=500, detail="Gemini API key not configured")
            chat_sessions[session_id] = GeminiFantasyAssistant(GEMINI_API_KEY)
        
        player = chat_sessions[session_id].get_player_info(query.player_id)
        
        if player:
            return {
                "success": True,
                "player": player.to_dict()
            }
        else:
            raise HTTPException(status_code=404, detail="Player not found")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reset")
async def reset_conversation(session_id: str = "default"):
    """Reset conversation history for a session"""
    try:
        if session_id in chat_sessions:
            chat_sessions[session_id].reset_conversation()
            return {
                "success": True,
                "message": "Conversation reset successfully"
            }
        else:
            return {
                "success": True,
                "message": "No active session to reset"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time chat
    """
    await websocket.accept()
    
    try:
        if not GEMINI_API_KEY:
            await websocket.send_json({
                "error": "Gemini API key not configured"
            })
            await websocket.close()
            return
        
        # Initialize chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = GeminiFantasyAssistant(GEMINI_API_KEY)
        
        # Send welcome message
        await websocket.send_json({
            "type": "welcome",
            "message": "Connected to Flow Fantasy Fusion AI Assistant!"
        })
        
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            message = data.get("message", "")
            context = data.get("context")
            
            # Get AI response
            result = await chat_sessions[session_id].chat(message, context)
            
            # Send response back to client
            await websocket.send_json({
                "type": "message",
                **result
            })
            
    except WebSocketDisconnect:
        print(f"Client {session_id} disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_json({
            "type": "error",
            "message": str(e)
        })

@app.get("/api/quick-suggestions")
async def quick_suggestions():
    """Get quick suggestion prompts for users"""
    return {
        "suggestions": [
            "Suggest a balanced lineup for me",
            "Show me a high-risk, high-reward lineup",
            "I want a safe, consistent lineup",
            "What's the best strategy for a small league?",
            "Explain how NFT values affect my lineup",
            "Which players are trending up right now?",
            "Help me build a team under 50 FLOW budget",
            "Compare conservative vs aggressive strategies"
        ]
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    print(f"🚀 Starting Gemini AI Chat Service on port {port}")
    print(f"📡 API Key configured: {bool(GEMINI_API_KEY)}")
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
