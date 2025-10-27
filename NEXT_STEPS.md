# ⚡ NEXT STEPS - Complete Your Submission

**Status**: ✅ Code 100% Complete | ⏳ Deployment Needed | ⏳ Demo Video Needed

This guide will walk you through the final steps to deploy and submit Flow Fantasy Fusion to Forte Hacks.

---

## 🎯 Quick Action Items (Do These Now)

### 1️⃣ Get Flow Testnet Account (5 minutes)

```bash
# Generate Flow keys
flow keys generate

# You'll see:
# 🔴️ Store private key safely and never share it!
# Private Key: abc123...
# Public Key: def456...
```

**Then**:
1. Visit https://testnet-faucet.onflow.org/
2. Paste your public key
3. Click "Fund Account"
4. Note your testnet address (e.g., `0x1234567890abcdef`)

### 2️⃣ Configure Environment (2 minutes)

```bash
cd /home/arpit/Desktop/hackathon_projects/Flow_Fantasy_Fusion

# Copy environment template
cp .env.example .env

# Edit .env with your editor
nano .env  # or vim, code, etc.
```

**Update these values**:
```env
TESTNET_PRIVATE_KEY=abc123...  # From step 1
SERVICE_ACCOUNT_ADDRESS=0x1234567890abcdef  # From testnet faucet
```

Save and exit.

### 3️⃣ Deploy to Flow Testnet (5 minutes)

```bash
# Deploy all contracts
bash scripts/deploy_contracts.sh
```

**Expected Output**:
```
🚀 Flow Fantasy Fusion - Contract Deployment
============================================

📦 Deploying contracts to Flow testnet...

1️⃣  Deploying LeagueFactory...
✅ LeagueFactory deployed at 0xYOUR_ADDRESS

2️⃣  Deploying StakingManager...
✅ StakingManager deployed at 0xYOUR_ADDRESS

3️⃣  Deploying Settlement...
✅ Settlement deployed at 0xYOUR_ADDRESS

🎉 All contracts deployed successfully!
```

**Copy the addresses!** You'll need them next.

### 4️⃣ Update Documentation (3 minutes)

**Edit README.md** - Find line ~150 and update:

```markdown
| Contract | Address | Explorer Link |
|----------|---------|---------------|
| LeagueFactory | `0xYOUR_ACTUAL_ADDRESS` | [View](https://testnet.flowscan.org/contract/A.YOUR_ACTUAL_ADDRESS.LeagueFactory) |
| StakingManager | `0xYOUR_ACTUAL_ADDRESS` | [View](https://testnet.flowscan.org/contract/A.YOUR_ACTUAL_ADDRESS.StakingManager) |
| Settlement | `0xYOUR_ACTUAL_ADDRESS` | [View](https://testnet.flowscan.org/contract/A.YOUR_ACTUAL_ADDRESS.Settlement) |
```

**Update .env** again:
```env
CONTRACT_LEAGUE_FACTORY=0xYOUR_ACTUAL_ADDRESS
CONTRACT_STAKING_MANAGER=0xYOUR_ACTUAL_ADDRESS
CONTRACT_SETTLEMENT=0xYOUR_ACTUAL_ADDRESS
```

### 5️⃣ Execute Test Transactions (5 minutes)

```bash
# Create a league
flow transactions send transactions/create_league.cdc \
  --arg String:"Forte Hacks Demo League" \
  --arg String:"Demo league for Forte Hacks submission" \
  --arg UFix64:$(date -d '+1 day' +%s 2>/dev/null || echo "1735689600") \
  --arg UFix64:$(date -d '+7 days' +%s 2>/dev/null || echo "1736294400") \
  --arg UInt32:2 \
  --arg UInt32:20 \
  --arg UFix64:5.0 \
  --arg '[String,String]:["FLOW","FUSD"]' \
  --arg Bool:true \
  --arg UFix64:1000.0 \
  --network testnet \
  --signer testnet-account

# Note the transaction ID that appears
# Example: Transaction ID: 0xabc123def456...
```

**Copy that transaction ID!**

```bash
# Stake tokens (execute Forte Action)
bash scripts/run_forte_action.sh 1 25.5 FLOW $(date -d '+7 days' +%s 2>/dev/null || echo "1736294400")
```

**Copy the stake and settlement transaction IDs!**

### 6️⃣ Add Transaction Links to README (2 minutes)

**Edit README.md** - Find line ~165 and update:

```markdown
| Transaction Type | TX ID | Explorer Link | Description |
|-----------------|-------|---------------|-------------|
| Contract Deployment | `0xYOUR_DEPLOY_TX` | [View](https://testnet.flowscan.org/transaction/0xYOUR_DEPLOY_TX) | LeagueFactory deployed |
| Stake Transaction | `0xYOUR_STAKE_TX` | [View](https://testnet.flowscan.org/transaction/0xYOUR_STAKE_TX) | 25.5 FLOW staked to League #1 |
| Settlement Transaction | `0xYOUR_SETTLE_TX` | [View](https://testnet.flowscan.org/transaction/0xYOUR_SETTLE_TX) | Automated settlement scheduled |
```

### 7️⃣ Create GitHub Repository (3 minutes)

```bash
cd /home/arpit/Desktop/hackathon_projects/Flow_Fantasy_Fusion

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Flow Fantasy Fusion for Forte Hacks

✨ Fresh Code
⚡ Built on Flow
🤖 AI-Powered Fantasy Sports
🎮 Forte Actions & Scheduled Transactions"

# Create repo on GitHub (via web UI):
# 1. Go to https://github.com/new
# 2. Name: flow-fantasy-fusion
# 3. Description: AI-powered fantasy sports on Flow with Forte Actions
# 4. Public repository
# 5. Click "Create repository"

# Then push
git remote add origin https://github.com/YOUR_USERNAME/flow-fantasy-fusion.git
git branch -M main
git push -u origin main
```

**Update README.md and submission.txt** with your GitHub URL!

### 8️⃣ Record Demo Video (15 minutes)

Follow the [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) guide:

**Quick Recording**:

1. Start all services:
   ```bash
   # Terminal 1
   npm run dev:backend
   
   # Terminal 2
   npm run dev:ai
   
   # Terminal 3
   npm run dev:frontend
   ```

2. Open Loom: https://www.loom.com/
   - Click "Start Recording"
   - Select "Screen + Camera" or just "Screen"
   - Choose browser window with `http://localhost:3000`

3. Record the demo (2-3 minutes):
   - Show homepage
   - Connect wallet
   - Create league
   - Join and stake
   - Request AI lineup
   - Show scheduled settlement
   - Show dashboard

4. Stop recording and get share link

5. Update README.md (line ~22):
   ```markdown
   🎥 **[Watch Demo Video](https://www.loom.com/share/YOUR_ACTUAL_VIDEO_ID)**
   ```

6. Update submission.txt (line ~130):
   ```
   DEMO VIDEO
   ----------
   https://www.loom.com/share/YOUR_ACTUAL_VIDEO_ID
   ```

### 9️⃣ Final Review Checklist (5 minutes)

Go through this checklist:

```bash
# Run this command to check your setup
cat << 'EOF' > check_submission.sh
#!/bin/bash
echo "🔍 Checking Flow Fantasy Fusion Submission..."
echo ""

# Check .env
if grep -q "your_private_key_here" .env; then
  echo "❌ .env still has placeholder values"
else
  echo "✅ .env configured"
fi

# Check README contract addresses
if grep -q "0xYOUR_ADDRESS_HERE" README.md; then
  echo "❌ README still has placeholder contract addresses"
else
  echo "✅ README has actual contract addresses"
fi

# Check README demo video
if grep -q "YOUR_VIDEO_ID" README.md; then
  echo "❌ README still has placeholder video link"
else
  echo "✅ README has actual demo video link"
fi

# Check git remote
if git remote -v | grep -q "YOUR_USERNAME"; then
  echo "❌ Git remote still has placeholder username"
else
  echo "✅ Git remote configured correctly"
fi

echo ""
echo "📊 Files check:"
ls -lh README.md submission.txt coverage.txt DEPLOYMENT.md 2>/dev/null | wc -l
echo "Expected: 4 files"

echo ""
echo "🎉 If all items are ✅, you're ready to submit!"
EOF

chmod +x check_submission.sh
./check_submission.sh
```

### 🔟 Submit to Hackathon (5 minutes)

1. Go to Forte Hacks submission page
2. Fill in:
   - **Project Name**: Flow Fantasy Fusion
   - **GitHub URL**: `https://github.com/YOUR_USERNAME/flow-fantasy-fusion`
   - **Demo Video**: `https://www.loom.com/share/YOUR_VIDEO_ID`
   - **Description**: Copy from submission.txt (lines 10-16)
   - **Contract Addresses**: From README.md
   - **Testnet Explorer**: `https://testnet.flowscan.org/account/YOUR_ADDRESS`

3. Paste contents of submission.txt into additional details

4. Click Submit! 🎉

---

## 📋 Complete Checklist

Copy this to track your progress:

```
DEPLOYMENT CHECKLIST
====================

Setup:
[ ] Generated Flow testnet account
[ ] Funded account with FLOW tokens
[ ] Updated .env with private key and address

Deployment:
[ ] Deployed LeagueFactory contract
[ ] Deployed StakingManager contract
[ ] Deployed Settlement contract
[ ] Noted all contract addresses
[ ] Updated README.md with addresses
[ ] Updated .env with contract addresses

Testing:
[ ] Executed create_league transaction
[ ] Executed stake_tokens transaction
[ ] Executed schedule_settlement transaction
[ ] Noted all transaction IDs
[ ] Updated README.md with transaction links
[ ] Verified transactions in explorer

Repository:
[ ] Created GitHub repository (public)
[ ] Pushed all code to GitHub
[ ] Updated README with GitHub URL
[ ] Repository topics added (flow, blockchain, forte)

Demo Video:
[ ] Recorded demo video (2-3 minutes)
[ ] Uploaded to Loom/YouTube
[ ] Updated README with video link
[ ] Updated submission.txt with video link

Final Review:
[ ] All README links work
[ ] No placeholder text in documentation
[ ] No secrets committed (.env in .gitignore)
[ ] Fresh Code declaration in submission.txt
[ ] All services tested locally
[ ] Ran check_submission.sh (all ✅)

Submission:
[ ] Filled hackathon submission form
[ ] Submitted GitHub URL
[ ] Submitted demo video link
[ ] Submitted contract addresses
[ ] Clicked final submit button

POST-SUBMISSION:
[ ] Celebrated! 🎉
[ ] Shared on Twitter (optional)
[ ] Shared in Flow Discord (optional)
```

---

## 🆘 Troubleshooting

### "flow: command not found"

```bash
sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
source ~/.bashrc  # or restart terminal
```

### "Insufficient balance"

Your testnet account needs more FLOW:
- Visit https://testnet-faucet.onflow.org/
- Request more tokens (can do multiple times)

### "Contract not found"

Make sure you updated flow.json with your testnet address:

```json
"testnet-account": {
  "address": "YOUR_ACTUAL_ADDRESS",
  "key": {
    "$env": "TESTNET_PRIVATE_KEY"
  }
}
```

### "Transaction failed"

Check the error message in terminal. Common issues:
- Wrong argument types (UInt64 vs UFix64)
- Missing arguments
- Contract not deployed yet
- Insufficient gas

### "Video won't upload"

- Check file size (max 4GB for Loom)
- Try YouTube if Loom fails
- Can use Google Drive + share link as fallback

---

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Get testnet account | 5 min |
| Configure environment | 2 min |
| Deploy contracts | 5 min |
| Update documentation | 3 min |
| Execute transactions | 5 min |
| Add transaction links | 2 min |
| Create GitHub repo | 3 min |
| Record demo video | 15 min |
| Final review | 5 min |
| Submit to hackathon | 5 min |
| **TOTAL** | **~50 minutes** |

---

## 🎯 What to Do Right Now

**If you have 50+ minutes**: Do all steps above in order

**If you have 30 minutes**: Skip GitHub creation, deploy and record demo

**If you have 15 minutes**: Just deploy contracts and record quick demo

**If you have 5 minutes**: Deploy contracts, copy addresses, submit with placeholder video (can update later)

---

## 🚀 Commands Summary

Here are all the commands you need, in order:

```bash
# 1. Setup Flow
flow keys generate
# Fund at https://testnet-faucet.onflow.org/

# 2. Configure
cd /home/arpit/Desktop/hackathon_projects/Flow_Fantasy_Fusion
cp .env.example .env
# Edit .env with your credentials

# 3. Deploy
bash scripts/deploy_contracts.sh
# Copy contract addresses

# 4. Update .env
# Add contract addresses to .env

# 5. Test transactions
bash scripts/run_forte_action.sh 1 25.5 FLOW $(date -d '+7 days' +%s 2>/dev/null || echo "1736294400")
# Copy transaction IDs

# 6. GitHub
git init
git add .
git commit -m "Flow Fantasy Fusion for Forte Hacks"
# Create repo at github.com/new
git remote add origin https://github.com/YOUR_USERNAME/flow-fantasy-fusion.git
git push -u origin main

# 7. Start services for demo
npm run dev:backend &
npm run dev:ai &
npm run dev:frontend
# Record demo at http://localhost:3000

# 8. Update README and submission.txt with actual URLs

# 9. Submit to hackathon!
```

---

## 🎉 You're Almost Done!

All the hard work (coding) is complete. Now it's just:
1. Deploy ✈️
2. Record 🎥
3. Submit 📬

**You've built something amazing. Finish strong! 💪**

---

**Questions?** Check:
- README.md (comprehensive guide)
- DEPLOYMENT.md (detailed deployment)
- DEMO_SCRIPT.md (video recording)
- QUICKSTART.md (quick reference)

**Need help?** 
- Flow Discord: https://discord.gg/flow
- Open GitHub issue (after creating repo)

**Good luck! 🍀**

**Now go deploy your submission! 🚀⚡🎮**
