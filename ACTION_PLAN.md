# ⚡ ACTION PLAN - Deploy to Production

## 🎯 Goal: Transform from demo to live production dApp

**Current Status**: Backend integration complete ✅  
**Next Step**: Deploy to Flow testnet and cloud services  
**Time Required**: ~40 minutes  

---

## 📋 YOUR STEP-BY-STEP CHECKLIST

### PHASE 1: Flow Testnet Setup (5 minutes)

#### Task 1.1: Generate Flow Keys
```bash
flow keys generate
```

**Expected Output:**
```
🔴️ Store private key safely and never share it!
Private Key: abc123def456...
Public Key: 789ghi012jkl...
```

**Action**: Copy both keys to a secure location

#### Task 1.2: Fund Your Account
1. Visit https://testnet-faucet.onflow.org/
2. Paste your **Public Key** (not private!)
3. Click "Fund Account"
4. Copy your testnet address (e.g., `0x1234567890abcdef`)

**✓ Checklist:**
- [ ] Private key saved securely
- [ ] Public key saved
- [ ] Testnet address noted
- [ ] Account funded with FLOW tokens

---

### PHASE 2: Configure Environment (2 minutes)

#### Task 2.1: Create .env File
```bash
cd /home/arpit/Desktop/hackathon_projects/Flow_Fantasy_Fusion
cp .env.example .env
nano .env  # or use your preferred editor
```

#### Task 2.2: Update These Values
```env
TESTNET_PRIVATE_KEY=your_private_key_from_task_1.1
SERVICE_ACCOUNT_ADDRESS=0xYOUR_ADDRESS_from_task_1.2
FLOW_NETWORK=testnet
```

**✓ Checklist:**
- [ ] .env file created
- [ ] Private key added
- [ ] Service account address added
- [ ] File saved

---

### PHASE 3: Deploy Smart Contracts (10 minutes)

#### Task 3.1: Run Deployment Script
```bash
bash scripts/production_deploy.sh
```

**What This Does:**
1. Checks prerequisites (Flow CLI, Node.js, Python)
2. Installs all dependencies
3. Deploys 3 contracts to testnet:
   - LeagueFactory
   - StakingManager
   - Settlement
4. Verifies deployment
5. Builds frontend
6. Tests backend
7. Generates deployment report

**Expected Output:**
```
🚀 Flow Fantasy Fusion - Production Deployment
==============================================

✓ Node.js found: v18.x.x
✓ Python found: Python 3.x.x
✓ Flow CLI found: v1.x.x
✓ .env file found

✅ LeagueFactory deployed at 0xABCDEF
✅ StakingManager deployed at 0x123456
✅ Settlement deployed at 0x789ABC

🎉 Production deployment complete!
```

**✓ Checklist:**
- [ ] Script completed without errors
- [ ] 3 contract addresses shown
- [ ] Contract addresses saved to .env
- [ ] Deployment report generated

---

### PHASE 4: Deploy Backend (5 minutes)

#### Option A: Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up
```

**In Railway Dashboard:**
1. Add environment variables:
   - `FLOW_NETWORK=testnet`
   - `FLOW_ACCESS_NODE=https://rest-testnet.onflow.org`
   - `CONTRACT_LEAGUE_FACTORY=0xYOUR_ADDRESS`
   - `CONTRACT_STAKING_MANAGER=0xYOUR_ADDRESS`
   - `CONTRACT_SETTLEMENT=0xYOUR_ADDRESS`
   - `AI_SERVICE_URL=` (will add after AI deployment)

**Backend URL**: Save this for later (e.g., `https://your-app.railway.app`)

#### Option B: Render

1. Go to https://render.com/
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: flow-fantasy-backend
   - **Root Directory**: backend
   - **Build Command**: npm install
   - **Start Command**: node index.js
5. Add environment variables (same as Railway)
6. Click "Create Web Service"

**✓ Checklist:**
- [ ] Backend deployed successfully
- [ ] Backend URL noted
- [ ] Health check passes: `curl YOUR_URL/api/health`

---

### PHASE 5: Deploy AI Service (5 minutes)

#### Use Render

1. Go to https://render.com/
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: flow-fantasy-ai
   - **Root Directory**: ai
   - **Build Command**: pip install -r requirements.txt
   - **Start Command**: python app.py
   - **Environment Variables**:
     - `PORT=5000`
     - `FLASK_ENV=production`
5. Click "Create Web Service"

**AI URL**: Save this (e.g., `https://your-ai.onrender.com`)

**✓ Checklist:**
- [ ] AI service deployed
- [ ] AI URL noted
- [ ] Health check passes: `curl YOUR_URL/health`
- [ ] Update backend env with AI_SERVICE_URL

---

### PHASE 6: Deploy Frontend (5 minutes)

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

**In Vercel Dashboard (during deployment):**
Add environment variables:
- `VITE_FLOW_NETWORK=testnet`
- `VITE_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org`
- `VITE_API_URL=YOUR_BACKEND_URL`
- `VITE_CONTRACT_LEAGUE_FACTORY=0xYOUR_ADDRESS`
- `VITE_CONTRACT_STAKING_MANAGER=0xYOUR_ADDRESS`
- `VITE_CONTRACT_SETTLEMENT=0xYOUR_ADDRESS`

#### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

**Frontend URL**: This is your live app URL!

**✓ Checklist:**
- [ ] Frontend deployed
- [ ] Frontend URL noted
- [ ] Environment variables set
- [ ] Site loads without errors

---

### PHASE 7: Testing (5 minutes)

#### Test 7.1: Backend Health
```bash
# Test health endpoint
curl https://your-backend-url.com/api/health

# Expected: {"status":"ok"}
```

#### Test 7.2: Backend Leagues
```bash
# Test leagues endpoint
curl https://your-backend-url.com/api/leagues

# Expected: {"success":true,"data":[],"source":"blockchain"}
```

#### Test 7.3: Frontend & Wallet
1. Visit your frontend URL
2. Click "Connect Wallet"
3. Select wallet (Blocto/Lilico)
4. Approve connection
5. Check that address appears in header

#### Test 7.4: Create Test League
1. Click "Create League"
2. Fill out form:
   - Name: "Test League"
   - Description: "Testing production deployment"
   - Entry Fee: 5.0 FLOW
   - Max Players: 10
3. Submit transaction
4. Approve in wallet
5. Wait for confirmation
6. **Copy transaction ID!**

#### Test 7.5: Verify on Blockchain
1. Visit https://testnet.flowscan.org/
2. Search for your transaction ID
3. Verify transaction succeeded
4. Check contract interactions

**✓ Checklist:**
- [ ] Backend health check passes
- [ ] Backend returns blockchain data
- [ ] Frontend loads correctly
- [ ] Wallet connects successfully
- [ ] Can create league (transaction succeeds)
- [ ] Transaction visible on explorer
- [ ] League appears in app

---

### PHASE 8: Documentation Update (3 minutes)

#### Update README.md

Find the "Deployed Contracts" section and add:

```markdown
## 🌐 Live Deployment

### Smart Contracts (Flow Testnet)
- **LeagueFactory**: [0xYOUR_ADDRESS](https://testnet.flowscan.org/contract/A.YOUR_ADDRESS.LeagueFactory)
- **StakingManager**: [0xYOUR_ADDRESS](https://testnet.flowscan.org/contract/A.YOUR_ADDRESS.StakingManager)
- **Settlement**: [0xYOUR_ADDRESS](https://testnet.flowscan.org/contract/A.YOUR_ADDRESS.Settlement)

### Live Services
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.railway.app
- **AI Service**: https://your-ai.onrender.com

### Test Transaction Examples
- Create League: [TX_ID](https://testnet.flowscan.org/transaction/TX_ID)
- Stake Tokens: [TX_ID](https://testnet.flowscan.org/transaction/TX_ID)
```

**✓ Checklist:**
- [ ] README.md updated with live URLs
- [ ] Contract addresses added
- [ ] Transaction examples added
- [ ] Changes committed to git

---

## 🎉 COMPLETION CHECKLIST

Copy this to track your full deployment:

```
FULL DEPLOYMENT STATUS
======================

✅ Code Preparation (DONE)
   ✅ Backend blockchain integration
   ✅ Mock data removed
   ✅ Deployment scripts created
   ✅ Documentation written

⏳ Your Tasks (DO NOW)
   [ ] Phase 1: Flow testnet setup
   [ ] Phase 2: Environment configuration
   [ ] Phase 3: Deploy smart contracts
   [ ] Phase 4: Deploy backend
   [ ] Phase 5: Deploy AI service
   [ ] Phase 6: Deploy frontend
   [ ] Phase 7: Test everything
   [ ] Phase 8: Update documentation

🎯 Final Verification
   [ ] All services live and accessible
   [ ] Wallet connection works
   [ ] Can create leagues
   [ ] Transactions succeed on testnet
   [ ] Data shows from blockchain
   [ ] Mobile responsive
   [ ] No console errors

📱 Share Your Success
   [ ] Record demo video
   [ ] Update GitHub repo
   [ ] Share on Twitter/Discord
   [ ] Submit to hackathon
```

---

## ⚡ Quick Reference Commands

```bash
# Flow testnet setup
flow keys generate
# Then fund at https://testnet-faucet.onflow.org/

# Deploy everything locally first
cd /home/arpit/Desktop/hackathon_projects/Flow_Fantasy_Fusion
bash scripts/production_deploy.sh

# Deploy backend
cd backend && railway up

# Deploy AI
# Use Render dashboard

# Deploy frontend
cd frontend && vercel --prod

# Test
curl https://your-backend-url/api/health
curl https://your-backend-url/api/leagues
```

---

## 📞 Need Help?

### Documentation
- **Quick Start**: QUICKSTART.md
- **Full Deployment**: PRODUCTION_DEPLOYMENT.md
- **Implementation**: IMPLEMENTATION_GUIDE.md
- **Summary**: PRODUCTION_READY_SUMMARY.md

### Common Issues

**"Flow CLI not found"**
```bash
sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
```

**"Insufficient balance"**
- Visit https://testnet-faucet.onflow.org/ and request more tokens

**"Transaction failed"**
- Check wallet has FLOW for gas
- Verify contract addresses in .env
- Check transaction on explorer for error details

**"API returning empty data"**
- Normal if no leagues created yet
- Create a test league to see data

### Support Links
- Flow Discord: https://discord.gg/flow
- Flow Docs: https://docs.onflow.org/
- Testnet Faucet: https://testnet-faucet.onflow.org/
- Testnet Explorer: https://testnet.flowscan.org/

---

## 🎯 Success Criteria

You'll know you're successful when:

1. ✅ All 3 contracts deployed to testnet
2. ✅ Contract addresses visible on Flow explorer
3. ✅ Backend API returns real blockchain data
4. ✅ Frontend connects to wallet
5. ✅ Can create leagues (transactions succeed)
6. ✅ Leagues visible on blockchain explorer
7. ✅ Dashboard shows real data
8. ✅ AI service returns lineup suggestions
9. ✅ Everything works on mobile
10. ✅ No mock data anywhere!

---

## 🚀 START HERE

**Ready to deploy? Begin with Phase 1:**

```bash
# Step 1: Generate keys
flow keys generate

# Step 2: Fund at https://testnet-faucet.onflow.org/

# Step 3: Configure
cd /home/arpit/Desktop/hackathon_projects/Flow_Fantasy_Fusion
cp .env.example .env
nano .env

# Step 4: Deploy!
bash scripts/production_deploy.sh
```

**Estimated total time: 40 minutes**  
**Result: Fully functional production dApp on Flow testnet!** 🎉

---

**You've got this! Let's go live! 🚀⚡**
