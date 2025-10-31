# 🚀 Deploy Smart Contracts NOW - Quick Guide

## Current Status
Your code is ready! You just need to configure your Flow testnet account.

---

## ⚡ Quick Deployment Steps

### Step 1: Get Flow Testnet Account (5 minutes)

#### Option A: If you already have Flow CLI installed

```bash
# Generate keys
flow keys generate

# You'll see:
# 🔴️ Store private key safely and never share it!
# Private Key: YOUR_PRIVATE_KEY_HERE
# Public Key: YOUR_PUBLIC_KEY_HERE
```

**SAVE BOTH KEYS SECURELY!**

#### Option B: If Flow CLI is not in PATH

You can also generate keys online:
1. Visit: https://flow-testnet-faucet.vercel.app/
2. Or use: https://testnet-faucet.onflow.org/

---

### Step 2: Fund Your Account

1. Visit https://testnet-faucet.onflow.org/
2. Paste your **PUBLIC KEY** (not private!)
3. Click "Fund Account"
4. **Save your testnet address** (e.g., `0x1234567890abcdef`)

---

### Step 3: Update flow.json

Replace the contents of `flow.json` with this:

```json
{
  "contracts": {
    "LeagueFactory": "./contracts/LeagueFactory.cdc",
    "StakingManager": "./contracts/StakingManager.cdc",
    "Settlement": "./contracts/Settlement.cdc"
  },
  "networks": {
    "emulator": "127.0.0.1:3569",
    "testnet": "access.devnet.nodes.onflow.org:9000"
  },
  "accounts": {
    "emulator-account": {
      "address": "f8d6e0586b0a20c7",
      "key": "your_emulator_key"
    },
    "testnet-account": {
      "address": "YOUR_TESTNET_ADDRESS_HERE",
      "key": {
        "$env": "TESTNET_PRIVATE_KEY"
      }
    }
  },
  "deployments": {
    "testnet": {
      "testnet-account": [
        "LeagueFactory",
        "StakingManager",
        "Settlement"
      ]
    }
  }
}
```

**Replace:**
- `YOUR_TESTNET_ADDRESS_HERE` with your actual testnet address

---

### Step 4: Update .env File

Make sure your `.env` file has these values:

```env
# Flow Network Configuration
FLOW_NETWORK=testnet
TESTNET_PRIVATE_KEY=your_actual_private_key_from_step_1
SERVICE_ACCOUNT_ADDRESS=your_testnet_address_from_step_2

# Contract Addresses (will be filled after deployment)
CONTRACT_LEAGUE_FACTORY=
CONTRACT_STAKING_MANAGER=
CONTRACT_SETTLEMENT=
```

---

### Step 5: Deploy Contracts

Now run the deployment script:

```bash
cd /home/arpit/Desktop/hackathon_projects/Flow_Fantasy_Fusion

# Source the env file
export $(cat .env | grep -v '^#' | xargs)

# Deploy contracts
bash scripts/deploy_contracts.sh
```

**Expected Output:**
```
🚀 Flow Fantasy Fusion - Contract Deployment
============================================

1️⃣  Deploying LeagueFactory...
✅ LeagueFactory deployed

2️⃣  Deploying StakingManager...
✅ StakingManager deployed

3️⃣  Deploying Settlement...
✅ Settlement deployed

🎉 All contracts deployed successfully!
```

---

### Step 6: Verify Deployment

Visit Flow testnet explorer:
```
https://testnet.flowscan.org/account/YOUR_TESTNET_ADDRESS
```

You should see your 3 deployed contracts!

---

## 🔧 Alternative: Manual Deployment

If the script has issues, you can deploy manually:

### Deploy LeagueFactory
```bash
flow accounts add-contract LeagueFactory ./contracts/LeagueFactory.cdc \
  --network testnet \
  --signer testnet-account
```

### Deploy StakingManager
```bash
flow accounts add-contract StakingManager ./contracts/StakingManager.cdc \
  --network testnet \
  --signer testnet-account
```

### Deploy Settlement
```bash
flow accounts add-contract Settlement ./contracts/Settlement.cdc \
  --network testnet \
  --signer testnet-account
```

---

## 🆘 Troubleshooting

### "flow: command not found"

**Fix 1:** Add Flow to PATH
```bash
export PATH=$PATH:$HOME/.local/bin
source ~/.bashrc
```

**Fix 2:** Reinstall Flow CLI
```bash
sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
```

### "error: contract not found"

Make sure you're in the project root directory:
```bash
cd /home/arpit/Desktop/hackathon_projects/Flow_Fantasy_Fusion
pwd  # Should show the project path
ls contracts/  # Should show LeagueFactory.cdc, etc.
```

### "error: invalid private key"

Double-check your private key in `.env`:
- No quotes around the key
- No extra spaces
- Should be a long hexadecimal string

### "error: account doesn't have enough FLOW"

Get more testnet FLOW:
- Visit https://testnet-faucet.onflow.org/
- Request tokens (can do multiple times)
- Wait 30 seconds between requests

---

## ✅ After Successful Deployment

Once contracts are deployed:

1. **Note Contract Addresses** from the deployment output

2. **Update .env**:
```env
CONTRACT_LEAGUE_FACTORY=0xYOUR_LEAGUE_FACTORY_ADDRESS
CONTRACT_STAKING_MANAGER=0xYOUR_STAKING_MANAGER_ADDRESS
CONTRACT_SETTLEMENT=0xYOUR_SETTLEMENT_ADDRESS
```

3. **Update frontend/.env**:
```env
VITE_CONTRACT_LEAGUE_FACTORY=0xYOUR_LEAGUE_FACTORY_ADDRESS
VITE_CONTRACT_STAKING_MANAGER=0xYOUR_STAKING_MANAGER_ADDRESS
VITE_CONTRACT_SETTLEMENT=0xYOUR_SETTLEMENT_ADDRESS
```

4. **Test the deployment**:
```bash
# Query all leagues (should return empty array)
flow scripts execute scripts/get_all_leagues.cdc --network testnet
```

---

## 🎉 Success!

Once you see all 3 contracts deployed, you're ready to:
- ✅ Deploy backend to Railway/Render
- ✅ Deploy AI service to Render
- ✅ Deploy frontend to Vercel/Netlify
- ✅ Test the full app!

---

## 📞 Next Steps

After contracts are deployed, follow the rest of `ACTION_PLAN.md` to:
1. Deploy backend to cloud
2. Deploy AI service
3. Deploy frontend
4. Test end-to-end

**You're almost there! 🚀**
