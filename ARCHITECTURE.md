# 🏗️ Flow Fantasy Fusion - Complete Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + Tailwind CSS)                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Flow Wallet │   │   AI Chat    │   │   Backend    │
│     (FCL)    │   │   Service    │   │     API      │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                   │
       │                  │                   │
       ▼                  ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│     Flow     │   │    Google    │   │   Database   │
│  Blockchain  │   │    Gemini    │   │   (Future)   │
│  (Testnet)   │   │     API      │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
```

## Component Breakdown

### 1. Frontend Layer (React)

```
frontend/
├── src/
│   ├── components/
│   │   ├── GeminiAIChat.jsx       ← NEW! AI Chat Interface
│   │   ├── GeminiAIChat.css       ← NEW! Styling
│   │   ├── WalletConnect.jsx      ← Flow wallet integration
│   │   ├── LeagueList.jsx         ← Display leagues
│   │   └── Dashboard.jsx          ← User dashboard
│   ├── services/
│   │   ├── flowService.js         ← Flow blockchain calls
│   │   └── aiService.js           ← NEW! AI API calls
│   └── App.jsx
```

**Technologies:**
- React 18
- Tailwind CSS
- Flow Client Library (FCL)
- Lucide Icons
- WebSocket client

### 2. AI Service Layer (Python + FastAPI)

```
ai/
├── gemini_app.py              ← NEW! FastAPI server
├── gemini_chat_service.py     ← NEW! Gemini AI logic
├── app.py                     ← Legacy Flask service
├── requirements.txt           ← Python dependencies
└── start_gemini.sh           ← Startup script
```

**Technologies:**
- FastAPI
- Google Gemini API
- WebSocket
- Python 3.9+

**Endpoints:**
- `POST /api/chat` - Main chat endpoint
- `POST /api/preferences` - Update user preferences
- `POST /api/player-info` - Get player details
- `WebSocket /ws/chat/{session_id}` - Real-time chat

### 3. Backend API Layer (Node.js)

```
backend/
├── src/
│   ├── routes/
│   │   ├── leagues.js         ← League management
│   │   ├── staking.js         ← Staking operations
│   │   └── settlement.js      ← Settlement triggers
│   ├── services/
│   │   ├── flowService.js     ← Flow blockchain
│   │   └── forteService.js    ← Forte integration
│   └── server.js
```

**Technologies:**
- Node.js + Express
- Flow SDK
- Forte API
- JWT authentication

### 4. Blockchain Layer (Flow)

```
contracts/
├── LeagueFactory.cdc          ← League creation & management
├── StakingManager.cdc         ← Token/NFT staking
└── Settlement.cdc             ← Automated settlements
```

**Deployed Contracts:**
- LeagueFactory: `0x854da73e...`
- StakingManager: `0x07bac5db...`
- Settlement: `0x5e514758...`

## Data Flow Diagrams

### User Creates League

```
User → Frontend → Backend API → Flow Blockchain
                                      ↓
                              LeagueFactory.cdc
                                      ↓
                              League Created Event
                                      ↓
                              Frontend Updates
```

### User Gets AI Lineup Suggestion

```
User Types Message
        ↓
Frontend (GeminiAIChat.jsx)
        ↓
HTTP POST /api/chat
        ↓
AI Service (gemini_app.py)
        ↓
Gemini Chat Service
        ↓
Google Gemini API
        ↓
AI Response Generated
        ↓
Lineup Data Calculated
        ↓
Response Sent to Frontend
        ↓
UI Updates with Lineup Preview
```

### User Stakes Tokens

```
User → Frontend → Flow Wallet (FCL)
                        ↓
                  User Approves TX
                        ↓
                  Flow Blockchain
                        ↓
                StakingManager.cdc
                        ↓
                  Tokens Escrowed
                        ↓
                  Event Emitted
                        ↓
                Backend Listens
                        ↓
                Frontend Updates
```

### Automated Settlement (Forte)

```
Game Ends
    ↓
Forte Scheduled Transaction Triggers
    ↓
Settlement.cdc executeSettlement()
    ↓
Calculate Scores
    ↓
Determine Winners
    ↓
StakingManager.cdc distributePayout()
    ↓
Transfer Tokens to Winners
    ↓
Events Emitted
    ↓
Frontend Updates
```

## Communication Protocols

### REST API (Backend ↔ Frontend)

```
GET    /api/leagues              - List all leagues
POST   /api/leagues              - Create new league
GET    /api/leagues/:id          - Get league details
POST   /api/leagues/:id/join     - Join league
POST   /api/leagues/:id/lineup   - Submit lineup
```

### WebSocket (AI Service ↔ Frontend)

```javascript
// Connect
ws = new WebSocket('ws://localhost:5001/ws/chat/user123')

// Send message
ws.send(JSON.stringify({
  message: "Suggest a lineup",
  context: {...}
}))

// Receive response
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Update UI
}
```

### Flow Blockchain (Frontend ↔ Contracts)

```javascript
// Using FCL
import * as fcl from "@onflow/fcl"

// Execute transaction
const txId = await fcl.mutate({
  cadence: CREATE_LEAGUE_TX,
  args: (arg, t) => [
    arg(name, t.String),
    arg(config, t.Dictionary)
  ]
})

// Wait for seal
const tx = await fcl.tx(txId).onceSealed()
```

## Technology Stack Summary

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Blockchain**: Flow Client Library (FCL)
- **State**: React Hooks
- **Build**: Vite/Create React App

### AI Service
- **Framework**: FastAPI
- **AI**: Google Gemini Pro
- **Language**: Python 3.9+
- **WebSocket**: FastAPI WebSocket
- **Async**: asyncio

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Blockchain**: Flow SDK
- **Automation**: Forte API
- **Auth**: JWT

### Blockchain
- **Platform**: Flow Blockchain
- **Language**: Cadence 1.0
- **Network**: Testnet
- **Wallet**: Blocto, Lilico

## Deployment Architecture

### Development

```
┌─────────────────────────────────────────┐
│         Local Development               │
├─────────────────────────────────────────┤
│ Frontend:  http://localhost:3000       │
│ Backend:   http://localhost:3001       │
│ AI Service: http://localhost:5001      │
│ Blockchain: Flow Testnet               │
└─────────────────────────────────────────┘
```

### Production (Future)

```
┌─────────────────────────────────────────┐
│         Production Deployment           │
├─────────────────────────────────────────┤
│ Frontend:  Vercel/Netlify              │
│ Backend:   Railway/Heroku              │
│ AI Service: Cloud Run/AWS Lambda       │
│ Blockchain: Flow Mainnet               │
│ CDN:       Cloudflare                  │
└─────────────────────────────────────────┘
```

## Security Architecture

### API Key Management
```
Environment Variables (.env)
    ↓
Never committed to Git
    ↓
Loaded at runtime
    ↓
Used in secure API calls
```

### User Authentication
```
User Wallet Address
    ↓
Signed Message
    ↓
Verify Signature
    ↓
Generate JWT Token
    ↓
Authenticated Requests
```

### Smart Contract Security
```
Access Control
    ↓
Input Validation
    ↓
Reentrancy Protection
    ↓
Escrow Management
    ↓
Event Emission
```

## Performance Considerations

### Caching Strategy
- **Frontend**: React Query for API responses
- **Backend**: Redis for frequently accessed data
- **AI Service**: Session-based conversation cache

### Optimization
- **Frontend**: Code splitting, lazy loading
- **Backend**: Connection pooling, rate limiting
- **AI Service**: Batch requests, response streaming

## Monitoring & Logging

### Frontend
- Console logging (development)
- Error tracking (Sentry)
- Analytics (Google Analytics)

### Backend
- Winston logging
- API metrics
- Error tracking

### AI Service
- Python logging
- Request/response tracking
- Performance metrics

### Blockchain
- Flow event monitoring
- Transaction tracking
- Gas usage analysis

## Scalability

### Horizontal Scaling
```
Load Balancer
    ↓
Multiple Backend Instances
    ↓
Shared Database
    ↓
Distributed Cache
```

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers

## Future Enhancements

### Phase 1
- [ ] Real player data integration
- [ ] Advanced caching
- [ ] Rate limiting
- [ ] Analytics dashboard

### Phase 2
- [ ] Mobile app (React Native)
- [ ] Voice interface
- [ ] Multi-language support
- [ ] Advanced ML models

### Phase 3
- [ ] Cross-chain support
- [ ] DAO governance
- [ ] NFT marketplace
- [ ] Social features

---

## Quick Reference

### Start All Services

```bash
# Terminal 1 - AI Service
cd ai/
./start_gemini.sh

# Terminal 2 - Backend
cd backend/
npm start

# Terminal 3 - Frontend
cd frontend/
npm start
```

### Environment Variables

```bash
# AI Service (.env)
GEMINI_API_KEY=your_key_here
PORT=5001

# Backend (.env)
FLOW_NETWORK=testnet
FLOW_ACCOUNT_ADDRESS=0xf474649aaa285cf5
FLOW_PRIVATE_KEY=your_key_here

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AI_URL=http://localhost:5001
REACT_APP_FLOW_NETWORK=testnet
```

### Port Mapping

- `3000` - Frontend (React)
- `3001` - Backend API (Node.js)
- `5000` - Legacy AI Service (Flask)
- `5001` - Gemini AI Service (FastAPI)

---

**This architecture provides a scalable, secure, and feature-rich foundation for Flow Fantasy Fusion!** 🚀
