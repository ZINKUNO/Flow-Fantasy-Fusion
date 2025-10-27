# 🚀 Quick Start Guide - Flow Fantasy Fusion

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+
- Python 3.8+
- Flow CLI
- Flow testnet account with FLOW tokens

Don't have these? Run the setup script to check:

```bash
bash scripts/setup.sh
```

## 30-Second Setup

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/flow-fantasy-fusion.git
cd flow-fantasy-fusion
npm install

# 2. Configure
cp .env.example .env
# Edit .env with your Flow testnet credentials

# 3. Deploy contracts
bash scripts/deploy_contracts.sh

# 4. Start all services
npm run dev:backend &   # Terminal 1
npm run dev:ai &        # Terminal 2  
npm run dev:frontend    # Terminal 3
```

## What Just Happened?

1. **Installed dependencies** for frontend, backend, and AI service
2. **Deployed smart contracts** to Flow testnet
3. **Started 3 services**:
   - Backend API: `http://localhost:3001`
   - AI Service: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

## Next Steps

### 1. Open the App

Visit `http://localhost:3000` in your browser

### 2. Connect Wallet

Click "Connect Wallet" → Select your Flow wallet → Approve

### 3. Create a League

Navigate to "Create League" → Fill form → Submit transaction

### 4. Join & Stake

Click on your league → Enter stake amount → Submit

### 5. Get AI Lineup

Click "Get AI Lineup Suggestion" → View results

### 6. Check Dashboard

Navigate to "Dashboard" → See your active leagues

## Common Issues

### "Flow CLI not found"

```bash
sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
```

### "Contract deployment failed"

Make sure your testnet account is funded:
- Visit https://testnet-faucet.onflow.org/
- Enter your address
- Request FLOW tokens

### "Frontend won't connect"

Update `frontend/.env`:
```env
VITE_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
VITE_API_URL=http://localhost:3001
```

### "AI service timeout"

Check if AI service is running:
```bash
curl http://localhost:5000/health
```

If not, start manually:
```bash
cd ai && python app.py
```

## Testing

### Quick Integration Test

```bash
bash scripts/test_flow.sh
```

This will:
1. Start Flow emulator
2. Deploy contracts
3. Create test league
4. Stake tokens
5. Submit lineup
6. Schedule settlement

### Manual Testing

```bash
# Create a league
flow transactions send transactions/create_league.cdc \
  --network testnet --signer testnet-account \
  [... args ...]

# Stake tokens
flow transactions send transactions/stake_tokens.cdc \
  --network testnet --signer testnet-account \
  [... args ...]
```

## Project Structure

```
flow-fantasy-fusion/
├── contracts/          # Cadence smart contracts
│   ├── LeagueFactory.cdc
│   ├── StakingManager.cdc
│   ├── Settlement.cdc
│   └── forte-actions/  # Forte Actions metadata
├── frontend/           # React app
│   └── src/
│       ├── pages/      # Main pages
│       ├── components/ # Reusable components
│       └── utils/      # Flow context & helpers
├── backend/            # Express API
│   └── api/            # API routes
├── ai/                 # Flask AI service
│   └── app.py          # Lineup predictor
├── scripts/            # Deployment & testing
│   ├── setup.sh
│   ├── deploy_contracts.sh
│   └── test_flow.sh
└── transactions/       # Cadence transactions
```

## Key Commands

```bash
# Setup
bash scripts/setup.sh

# Deploy contracts
bash scripts/deploy_contracts.sh

# Start services
npm run dev:frontend
npm run dev:backend
npm run dev:ai

# Run tests
npm test
bash scripts/test_flow.sh

# Execute Forte Action
bash scripts/run_forte_action.sh 1 25.5 FLOW 1735689600
```

## Environment Variables

### Root `.env`

```env
TESTNET_PRIVATE_KEY=your_key
SERVICE_ACCOUNT_ADDRESS=your_address
FLOW_NETWORK=testnet
CONTRACT_LEAGUE_FACTORY=deployed_address
CONTRACT_STAKING_MANAGER=deployed_address
CONTRACT_SETTLEMENT=deployed_address
```

### Frontend `frontend/.env`

```env
VITE_FLOW_NETWORK=testnet
VITE_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
VITE_API_URL=http://localhost:3001
VITE_CONTRACT_LEAGUE_FACTORY=deployed_address
```

### Backend `backend/.env`

```env
PORT=3001
NODE_ENV=development
FLOW_NETWORK=testnet
AI_SERVICE_URL=http://localhost:5000
```

## Useful Links

- **Flow Testnet Faucet**: https://testnet-faucet.onflow.org/
- **Flow Testnet Explorer**: https://testnet.flowscan.org/
- **Flow Docs**: https://docs.onflow.org/
- **Forte Docs**: https://docs.forte.io/
- **GitHub Repo**: https://github.com/YOUR_USERNAME/flow-fantasy-fusion

## Need Help?

1. Check the [README.md](./README.md) for detailed documentation
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
3. Open an issue on GitHub
4. Ask in Flow Discord: https://discord.gg/flow

## What's Next?

- ✅ Local development running
- ⏳ Deploy to testnet (see DEPLOYMENT.md)
- ⏳ Record demo video (see DEMO_SCRIPT.md)
- ⏳ Submit to hackathon

**Happy coding! 🎮⚡**
