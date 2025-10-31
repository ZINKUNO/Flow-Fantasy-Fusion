# 🚀 Production Deployment Guide - Flow Fantasy Fusion

## Overview
This guide walks you through deploying Flow Fantasy Fusion to production with **real blockchain data**, **live APIs**, and **full functionality**.

---

## 📋 Prerequisites

### Required Accounts & Tools
- [x] Flow testnet account with FLOW tokens
- [x] GitHub account for version control
- [x] Vercel/Netlify account for frontend hosting
- [x] Railway/Render account for backend hosting
- [x] Render/Heroku account for AI service
- [ ] MongoDB Atlas account (optional - for caching)
- [ ] Domain name (optional)

### Local Requirements
- Node.js 18+
- Python 3.8+
- Flow CLI installed
- Git

---

## Phase 1: Deploy Smart Contracts to Testnet

### Step 1.1: Get Flow Testnet Account

```bash
# Generate new Flow keys
flow keys generate

# Output will show:
# Private Key: YOUR_PRIVATE_KEY
# Public Key: YOUR_PUBLIC_KEY

# ⚠️ SAVE THESE SECURELY!
```

### Step 1.2: Fund Your Account

1. Visit https://testnet-faucet.onflow.org/
2. Paste your **Public Key**
3. Click "Fund Account"
4. Note your testnet address (e.g., `0x1234567890abcdef`)

### Step 1.3: Configure Flow Environment

```bash
# Update .env
cat > .env << EOF
TESTNET_PRIVATE_KEY=your_actual_private_key_here
SERVICE_ACCOUNT_ADDRESS=0xYOUR_TESTNET_ADDRESS
FLOW_NETWORK=testnet
EOF
```

### Step 1.4: Deploy Contracts

```bash
# Deploy all contracts
bash scripts/deploy_contracts.sh

# Expected output:
# ✅ LeagueFactory deployed at 0xADDRESS1
# ✅ StakingManager deployed at 0xADDRESS2
# ✅ Settlement deployed at 0xADDRESS3
```

### Step 1.5: Save Contract Addresses

```bash
# Update .env with deployed addresses
echo "CONTRACT_LEAGUE_FACTORY=0xADDRESS1" >> .env
echo "CONTRACT_STAKING_MANAGER=0xADDRESS2" >> .env
echo "CONTRACT_SETTLEMENT=0xADDRESS3" >> .env
```

### Step 1.6: Verify on Explorer

Visit https://testnet.flowscan.org/ and search for your address to verify contracts.

---

## Phase 2: Set Up Production Backend

### Step 2.1: Install Flow SDK in Backend

```bash
cd backend

# Install Flow SDK
npm install @onflow/fcl @onflow/types @onflow/sdk

# Install additional dependencies
npm install dotenv mongodb express-rate-limit helmet cors
```

### Step 2.2: Create Flow Service

Create `backend/services/flowService.js`:

```javascript
const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

// Configure FCL
fcl.config()
  .put("accessNode.api", process.env.FLOW_ACCESS_NODE)
  .put("flow.network", process.env.FLOW_NETWORK)
  .put("app.detail.title", "Flow Fantasy Fusion");

class FlowService {
  // Get all leagues
  async getLeagues() {
    const script = `
      import LeagueFactory from ${process.env.CONTRACT_LEAGUE_FACTORY}
      
      pub fun main(): [AnyStruct] {
        return LeagueFactory.getLeagues()
      }
    `;
    
    return await fcl.query({ cadence: script });
  }

  // Get league details
  async getLeagueDetails(leagueId) {
    const script = `
      import LeagueFactory from ${process.env.CONTRACT_LEAGUE_FACTORY}
      
      pub fun main(leagueId: UInt64): AnyStruct? {
        return LeagueFactory.getLeagueDetails(leagueId: leagueId)
      }
    `;
    
    return await fcl.query({ 
      cadence: script,
      args: (arg, t) => [arg(leagueId, t.UInt64)]
    });
  }

  // Get user stakes
  async getUserStakes(address) {
    const script = `
      import StakingManager from ${process.env.CONTRACT_STAKING_MANAGER}
      
      pub fun main(address: Address): [AnyStruct] {
        return StakingManager.getUserStakes(address: address)
      }
    `;
    
    return await fcl.query({ 
      cadence: script,
      args: (arg, t) => [arg(address, t.Address)]
    });
  }
}

module.exports = new FlowService();
```

### Step 2.3: Update Backend Routes

Update `backend/api/leagues.js` to use real data:

```javascript
const express = require('express');
const router = express.Router();
const flowService = require('../services/flowService');

// Get all leagues - REAL DATA
router.get('/', async (req, res) => {
  try {
    const leagues = await flowService.getLeagues();
    res.json({ success: true, data: leagues });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get league by ID - REAL DATA
router.get('/:leagueId', async (req, res) => {
  try {
    const { leagueId } = req.params;
    const league = await flowService.getLeagueDetails(parseInt(leagueId));
    
    if (!league) {
      return res.status(404).json({ success: false, error: 'League not found' });
    }
    
    res.json({ success: true, data: league });
  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### Step 2.4: Update Environment Variables

```bash
# backend/.env
PORT=3001
NODE_ENV=production
FLOW_NETWORK=testnet
FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
CONTRACT_LEAGUE_FACTORY=0xYOUR_ADDRESS
CONTRACT_STAKING_MANAGER=0xYOUR_ADDRESS
CONTRACT_SETTLEMENT=0xYOUR_ADDRESS
AI_SERVICE_URL=https://your-ai-service.onrender.com
```

---

## Phase 3: Deploy Backend to Cloud

### Option A: Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add environment variables in Railway dashboard
railway variables set FLOW_NETWORK=testnet
railway variables set FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
# ... add all other variables

# Deploy
railway up
```

### Option B: Deploy to Render

1. Go to https://render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: flow-fantasy-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node index.js`
   - **Plan**: Free
5. Add environment variables in dashboard
6. Click "Create Web Service"

### Step 3.1: Note Backend URL

```bash
# Your backend will be at:
https://flow-fantasy-backend.onrender.com
# or
https://flow-fantasy-backend.up.railway.app
```

---

## Phase 4: Deploy AI Service

### Step 4.1: Deploy to Render

1. Go to https://render.com/
2. Click "New +" → "Web Service"
3. Connect repository
4. Configure:
   - **Name**: flow-fantasy-ai
   - **Environment**: Python
   - **Build Command**: `cd ai && pip install -r requirements.txt`
   - **Start Command**: `cd ai && python app.py`
   - **Plan**: Free
5. Add environment variables:
   - `FLASK_ENV=production`
   - `PORT=5000`
6. Deploy

### Step 4.2: Update AI Service for Production

Update `ai/app.py`:

```python
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Use PORT from environment
PORT = int(os.environ.get('PORT', 5000))

# ... rest of your AI code ...

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=False)
```

---

## Phase 5: Update Frontend for Production

### Step 5.1: Update FlowContext for Real Transactions

Update `frontend/src/utils/FlowContext.jsx`:

```javascript
import * as fcl from "@onflow/fcl";
import { useState, useEffect, createContext, useContext } from "react";

// Configure FCL for testnet
fcl.config({
  "accessNode.api": import.meta.env.VITE_FLOW_ACCESS_NODE,
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "0xLeagueFactory": import.meta.env.VITE_CONTRACT_LEAGUE_FACTORY,
  "0xStakingManager": import.meta.env.VITE_CONTRACT_STAKING_MANAGER,
  "0xSettlement": import.meta.env.VITE_CONTRACT_SETTLEMENT,
});

const FlowContext = createContext();

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within FlowProvider");
  }
  return context;
};

export const FlowProvider = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  const logIn = async () => {
    setIsLoading(true);
    try {
      await fcl.authenticate();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    setIsLoading(true);
    try {
      await fcl.unauthenticate();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create league transaction
  const createLeague = async (leagueData) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import LeagueFactory from 0xLeagueFactory
        
        transaction(
          name: String,
          description: String,
          startTime: UFix64,
          endTime: UFix64,
          minPlayers: UInt32,
          maxPlayers: UInt32,
          entryFee: UFix64,
          allowedTokens: [String],
          allowNFTs: Bool,
          maxStakePerUser: UFix64
        ) {
          prepare(signer: AuthAccount) {
            LeagueFactory.createLeague(
              name: name,
              description: description,
              startTime: startTime,
              endTime: endTime,
              minPlayers: minPlayers,
              maxPlayers: maxPlayers,
              entryFee: entryFee,
              allowedTokens: allowedTokens,
              allowNFTs: allowNFTs,
              maxStakePerUser: maxStakePerUser
            )
          }
        }
      `,
      args: (arg, t) => [
        arg(leagueData.name, t.String),
        arg(leagueData.description, t.String),
        arg(leagueData.startTime, t.UFix64),
        arg(leagueData.endTime, t.UFix64),
        arg(leagueData.minPlayers, t.UInt32),
        arg(leagueData.maxPlayers, t.UInt32),
        arg(leagueData.entryFee, t.UFix64),
        arg(leagueData.allowedTokens, t.Array(t.String)),
        arg(leagueData.allowNFTs, t.Bool),
        arg(leagueData.maxStakePerUser, t.UFix64),
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 9999,
    });

    return fcl.tx(transactionId).onceSealed();
  };

  // Stake tokens transaction
  const stakeTokens = async (leagueId, amount, tokenType) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import StakingManager from 0xStakingManager
        import FungibleToken from 0xFUNGIBLETOKEN
        import FlowToken from 0xFLOWTOKEN
        
        transaction(leagueId: UInt64, amount: UFix64, tokenType: String) {
          prepare(signer: AuthAccount) {
            let vault = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
              ?? panic("Could not borrow Flow vault")
            
            let tokens <- vault.withdraw(amount: amount)
            
            StakingManager.stake(
              leagueId: leagueId,
              tokens: <-tokens,
              tokenType: tokenType
            )
          }
        }
      `,
      args: (arg, t) => [
        arg(leagueId, t.UInt64),
        arg(amount.toFixed(8), t.UFix64),
        arg(tokenType, t.String),
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 9999,
    });

    return fcl.tx(transactionId).onceSealed();
  };

  const value = {
    user,
    isAuthenticated: user.loggedIn,
    logIn,
    logOut,
    isLoading,
    createLeague,
    stakeTokens,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};
```

### Step 5.2: Update Frontend Environment

Create `frontend/.env.production`:

```env
VITE_FLOW_NETWORK=testnet
VITE_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
VITE_API_URL=https://flow-fantasy-backend.onrender.com
VITE_CONTRACT_LEAGUE_FACTORY=0xYOUR_ADDRESS
VITE_CONTRACT_STAKING_MANAGER=0xYOUR_ADDRESS
VITE_CONTRACT_SETTLEMENT=0xYOUR_ADDRESS
```

### Step 5.3: Update Leagues Page for Real Data

Update `frontend/src/pages/Leagues.jsx`:

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/leagues`);
      setLeagues(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching leagues:', err);
      setError('Failed to load leagues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-flow-green mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leagues from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchLeagues} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-text">Active Leagues</h1>
        <Link to="/leagues/create" className="btn-primary">
          Create League
        </Link>
      </div>

      {leagues.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-6">No active leagues found</p>
          <Link to="/leagues/create" className="btn-primary">
            Create the First League
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <Link
              key={league.id}
              to={`/leagues/${league.id}`}
              className="card group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold group-hover:text-flow-green transition-colors">
                  {league.name}
                </h3>
                <Trophy className="w-6 h-6 text-flow-green" />
              </div>

              <p className="text-gray-400 mb-4 line-clamp-2">
                {league.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    Players
                  </span>
                  <span className="font-semibold">
                    {league.participantCount}/{league.maxPlayers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    Entry Fee
                  </span>
                  <span className="font-semibold text-flow-green">
                    {league.entryFee} FLOW
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    Status
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    league.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {league.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leagues;
```

---

## Phase 6: Deploy Frontend

### Option A: Deploy to Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Option B: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Step 6.1: Configure Environment in Dashboard

Add these environment variables in Vercel/Netlify:
- `VITE_FLOW_NETWORK=testnet`
- `VITE_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org`
- `VITE_API_URL=your-backend-url`
- `VITE_CONTRACT_LEAGUE_FACTORY=0xYOUR_ADDRESS`
- `VITE_CONTRACT_STAKING_MANAGER=0xYOUR_ADDRESS`
- `VITE_CONTRACT_SETTLEMENT=0xYOUR_ADDRESS`

---

## Phase 7: Testing & Validation

### Step 7.1: Test Contract Deployment

```bash
# Query deployed contract
flow scripts execute scripts/get_leagues.cdc --network testnet
```

### Step 7.2: Test Backend API

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Get leagues
curl https://your-backend.onrender.com/api/leagues
```

### Step 7.3: Test Frontend

1. Visit your deployed frontend URL
2. Connect wallet
3. Create a test league
4. Verify on Flow testnet explorer
5. Test staking
6. Test AI lineup request

---

## Phase 8: Monitoring & Maintenance

### Set Up Monitoring

1. **Backend Monitoring**
   - Use Render/Railway built-in logs
   - Set up error tracking (Sentry)

2. **Frontend Monitoring**
   - Vercel Analytics
   - Google Analytics

3. **Blockchain Monitoring**
   - Flow testnet explorer
   - Set up alerts for failed transactions

---

## Production Checklist

### Pre-Deployment
- [ ] All contracts deployed to testnet
- [ ] Contract addresses saved
- [ ] Backend environment configured
- [ ] AI service environment configured
- [ ] Frontend environment configured
- [ ] All mock data removed
- [ ] Real API integrations tested locally

### Deployment
- [ ] Backend deployed and accessible
- [ ] AI service deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] All services can communicate
- [ ] Environment variables set correctly

### Post-Deployment
- [ ] Create test league on production
- [ ] Test wallet connection
- [ ] Test transaction execution
- [ ] Test AI lineup generation
- [ ] Verify data on blockchain explorer
- [ ] Check all API endpoints
- [ ] Test on mobile devices

### Documentation
- [ ] Update README with production URLs
- [ ] Document API endpoints
- [ ] Create user guide
- [ ] Add troubleshooting section

---

## Troubleshooting

### Common Issues

#### "Transaction failed"
- Check wallet has enough FLOW for gas
- Verify contract addresses are correct
- Check transaction limits

#### "API not responding"
- Verify backend URL in frontend env
- Check backend logs for errors
- Verify CORS settings

#### "Wallet won't connect"
- Clear browser cache
- Try different wallet (Blocto, Lilico)
- Check FCL configuration

---

## Next Steps

1. ✅ Complete this deployment guide
2. ⏳ Deploy contracts (run script)
3. ⏳ Deploy backend service
4. ⏳ Deploy AI service
5. ⏳ Deploy frontend
6. ⏳ Test end-to-end
7. ⏳ Share production URLs

---

## Support

- **Flow Discord**: https://discord.gg/flow
- **Flow Documentation**: https://docs.onflow.org/
- **FCL Documentation**: https://docs.onflow.org/fcl/

---

**Ready to deploy! Follow each phase in order for best results.** 🚀
