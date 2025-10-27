# Deployment Guide - Flow Fantasy Fusion

This guide provides step-by-step instructions for deploying Flow Fantasy Fusion to Flow testnet and production environments.

## Prerequisites

- [ ] Flow CLI installed and configured
- [ ] Flow testnet account with FLOW tokens (get from [testnet faucet](https://testnet-faucet.onflow.org/))
- [ ] Node.js 18+ and Python 3.8+ installed
- [ ] Git repository set up

## Step 1: Environment Setup

### 1.1 Configure Flow Account

```bash
# Add testnet account to Flow CLI
flow keys generate

# Note the private key and public key
# Fund your account at https://testnet-faucet.onflow.org/
```

### 1.2 Update Environment Files

Create `.env` from template:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
TESTNET_PRIVATE_KEY=your_private_key_here
SERVICE_ACCOUNT_ADDRESS=your_testnet_address_here
FLOW_NETWORK=testnet
```

## Step 2: Deploy Smart Contracts

### 2.1 Deploy to Testnet

```bash
bash scripts/deploy_contracts.sh
```

Expected output:
```
🚀 Flow Fantasy Fusion - Contract Deployment
============================================

📦 Deploying contracts to Flow testnet...

1️⃣  Deploying LeagueFactory...
✅ LeagueFactory deployed

2️⃣  Deploying StakingManager...
✅ StakingManager deployed

3️⃣  Deploying Settlement...
✅ Settlement deployed

🎉 All contracts deployed successfully!
```

### 2.2 Note Contract Addresses

After deployment, note the contract addresses from the output:

```
LeagueFactory: 0xYOUR_ADDRESS
StakingManager: 0xYOUR_ADDRESS
Settlement: 0xYOUR_ADDRESS
```

### 2.3 Update Configuration Files

Update `.env`:
```env
CONTRACT_LEAGUE_FACTORY=0xYOUR_ADDRESS
CONTRACT_STAKING_MANAGER=0xYOUR_ADDRESS
CONTRACT_SETTLEMENT=0xYOUR_ADDRESS
```

Update `frontend/.env`:
```env
VITE_CONTRACT_LEAGUE_FACTORY=0xYOUR_ADDRESS
VITE_CONTRACT_STAKING_MANAGER=0xYOUR_ADDRESS
VITE_CONTRACT_SETTLEMENT=0xYOUR_ADDRESS
```

Update `README.md` with explorer links:
```markdown
| LeagueFactory | `0xYOUR_ADDRESS` | [View](https://testnet.flowscan.org/contract/A.YOUR_ADDRESS.LeagueFactory) |
```

## Step 3: Deploy Backend Services

### 3.1 Backend API (Node.js)

#### Option A: Deploy to Heroku

```bash
cd backend

# Create Heroku app
heroku create flow-fantasy-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FLOW_NETWORK=testnet
heroku config:set AI_SERVICE_URL=https://your-ai-service.com

# Deploy
git subtree push --prefix backend heroku main

# Verify
heroku logs --tail
```

#### Option B: Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and init
railway login
railway init

# Set environment variables
railway variables set NODE_ENV=production

# Deploy
railway up
```

### 3.2 AI Service (Python/Flask)

#### Deploy to Render

1. Create `render.yaml`:

```yaml
services:
  - type: web
    name: flow-fantasy-ai
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn --bind 0.0.0.0:$PORT ai.app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.0
```

2. Deploy:
```bash
# Connect to Render via dashboard
# Or use render CLI
```

### 3.3 Frontend (React)

#### Deploy to Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# VITE_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
# VITE_API_URL=https://your-backend-api.com
```

#### Deploy to Netlify

```bash
# Build production
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=build
```

## Step 4: Verify Deployment

### 4.1 Check Smart Contracts

Visit Flow testnet explorer:
```
https://testnet.flowscan.org/account/YOUR_ADDRESS
```

Verify:
- [ ] All 3 contracts visible
- [ ] Contract code matches local files
- [ ] No deployment errors

### 4.2 Test Backend API

```bash
# Health check
curl https://your-api.com/api/health

# Expected response:
{
  "status": "healthy",
  "services": {
    "api": "operational",
    "blockchain": "connected"
  }
}
```

### 4.3 Test AI Service

```bash
curl -X POST https://your-ai-service.com/api/ai/predict-lineup \
  -H "Content-Type: application/json" \
  -d '{
    "leagueId": 1,
    "playerAddress": "0x01",
    "availablePlayers": [1,2,3,4,5],
    "positions": ["PG","SG","SF","PF","C"]
  }'
```

### 4.4 Test Frontend

1. Visit your deployed frontend URL
2. Connect wallet (use testnet)
3. Create test league
4. Verify transaction appears in explorer

## Step 5: Execute Test Transactions

### 5.1 Create League

```bash
flow transactions send transactions/create_league.cdc \
  --arg String:"Test League" \
  --arg String:"Integration test" \
  --arg UFix64:$(date -d '+1 day' +%s) \
  --arg UFix64:$(date -d '+7 days' +%s) \
  --arg UInt32:2 \
  --arg UInt32:10 \
  --arg UFix64:5.0 \
  --arg [String,String]:FLOW,FUSD \
  --arg Bool:true \
  --arg UFix64:1000.0 \
  --network testnet \
  --signer testnet-account
```

### 5.2 Stake Tokens

```bash
flow transactions send transactions/stake_tokens.cdc \
  --arg UInt64:1 \
  --arg UFix64:10.0 \
  --arg String:FLOW \
  --network testnet \
  --signer testnet-account
```

### 5.3 Schedule Settlement

```bash
flow transactions send transactions/schedule_settlement.cdc \
  --arg UInt64:1 \
  --arg UFix64:$(date -d '+7 days' +%s) \
  --arg String:"0x$(openssl rand -hex 32)" \
  --network testnet \
  --signer testnet-account
```

## Step 6: Document Explorer Links

Update `README.md` with actual transaction links:

```markdown
| Stake Transaction | `0xABCDEF...` | [View](https://testnet.flowscan.org/transaction/0xABCDEF...) |
```

## Step 7: Record Demo Video

### Prepare Demo Script

1. **Intro (30 sec)**
   - "Welcome to Flow Fantasy Fusion"
   - Show homepage
   - Explain concept

2. **Wallet Connect (20 sec)**
   - Click "Connect Wallet"
   - Connect Flow wallet
   - Show connected address

3. **Create League (30 sec)**
   - Navigate to "Create League"
   - Fill form with demo data
   - Submit transaction
   - Show transaction in explorer

4. **Join & Stake (30 sec)**
   - View league details
   - Enter stake amount
   - Submit stake transaction
   - Confirm in wallet

5. **AI Lineup (20 sec)**
   - Click "Get AI Lineup Suggestion"
   - Show AI response
   - Explain rationale

6. **Schedule Settlement (20 sec)**
   - Click "Schedule Settlement"
   - Show Forte Scheduled Transaction
   - Explain automation

7. **Dashboard (20 sec)**
   - Navigate to dashboard
   - Show active leagues
   - Show stats

8. **Conclusion (10 sec)**
   - Thank viewers
   - Show GitHub link

### Recording Tools

- **Loom**: https://www.loom.com/ (recommended)
- **OBS Studio**: Free screen recorder
- **Screencastify**: Chrome extension

### Upload & Link

1. Upload to Loom/YouTube
2. Update `README.md` with video link
3. Update `submission.txt` with video link

## Step 8: Final Checklist

Before submission:

- [ ] All contracts deployed to testnet
- [ ] Contract addresses in README
- [ ] 3+ transaction explorer links documented
- [ ] Backend API deployed and accessible
- [ ] AI service deployed and responding
- [ ] Frontend deployed and functional
- [ ] Demo video recorded and uploaded
- [ ] Video link in README and submission.txt
- [ ] All environment variables configured
- [ ] No secrets committed to Git
- [ ] .env.example is complete
- [ ] GitHub repository is public
- [ ] README has "Built on Flow" badge
- [ ] Fresh Code declaration in submission.txt

## Troubleshooting

### Contract Deployment Fails

**Error**: "Account not found"
- **Solution**: Verify testnet account is funded at https://testnet-faucet.onflow.org/

**Error**: "Contract already exists"
- **Solution**: Use update-contract instead of add-contract

### Transaction Fails

**Error**: "Insufficient balance"
- **Solution**: Ensure account has enough FLOW for gas + stake

**Error**: "Signature verification failed"
- **Solution**: Check TESTNET_PRIVATE_KEY in .env

### Frontend Can't Connect

**Error**: "Network error"
- **Solution**: Verify VITE_FLOW_ACCESS_NODE is correct (https://rest-testnet.onflow.org)

**Error**: "Contract not found"
- **Solution**: Update contract addresses in frontend/.env

### AI Service Timeout

**Error**: "Connection refused"
- **Solution**: Ensure AI service is running and URL is correct

## Production Deployment (Post-Hackathon)

For mainnet deployment:

1. **Audit Contracts**
   - Hire professional audit (CertiK, Trail of Bits)
   - Fix all vulnerabilities
   - Add emergency pause mechanism

2. **Update Networks**
   - Change FLOW_NETWORK=mainnet
   - Update access nodes to mainnet
   - Use mainnet wallet discovery

3. **Scale Services**
   - Add load balancers
   - Implement caching (Redis)
   - Use CDN for frontend
   - Database for persistence

4. **Monitoring**
   - Add Sentry for error tracking
   - Use Datadog/New Relic for APM
   - Set up alerts

5. **Legal**
   - Terms of service
   - Privacy policy
   - Fantasy sports compliance
   - KYC/AML if required

---

**Need Help?**

- Flow Discord: https://discord.gg/flow
- Forte Docs: https://docs.forte.io/
- GitHub Issues: Open an issue in the repo

**Good luck with your deployment! 🚀**
