# 🚀 Deploy the Fix - Quick Guide

## What Needs to Be Done

The contract has been updated with a new public function. You need to **redeploy it to testnet**.

## ⚡ Quick Deploy (3 Options)

### Option 1: Flow CLI (Fastest)

```bash
flow accounts update-contract LeagueFactory contracts/LeagueFactory.cdc --network testnet --signer testnet-account
```

### Option 2: Deployment Script

```bash
./deploy_updated_contract.sh
```

### Option 3: Copy & Paste (No CLI needed)

If you don't have Flow CLI:

1. **Copy the entire contract**:
   - Open `contracts/LeagueFactory.cdc`
   - Copy all contents (Ctrl+A, Ctrl+C)

2. **Go to Flow Playground**:
   - Visit: https://play.flow.com/
   - Connect your wallet (same one with address `0xf474649aaa285cf5`)

3. **Update the contract**:
   - Paste the contract code
   - Click "Deploy"
   - Approve in wallet

## ✅ After Deployment

1. **Restart frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Try creating a league again**:
   - Open http://localhost:3000
   - Connect wallet
   - Go to "Create League"
   - Fill form and submit
   - Approve transaction
   - ✅ Success!

## 🎯 What Was Fixed

**The Error**:
```
mismatched types: expected 'PublicPath', got 'StoragePath'
```

**The Solution**:
- Added `createLeaguePublic()` function to contract
- Updated transaction to use this simpler function
- No more path/capability issues

## 📋 Files Changed

1. ✅ `contracts/LeagueFactory.cdc` - Added public function
2. ✅ `frontend/src/pages/CreateLeague.jsx` - Simplified transaction

## 🔍 Verify It Works

After deploying, create a test league:

```
Name: Test League
Description: Testing the fix
Start: 1 hour from now
End: 24 hours from now
Min Players: 2
Max Players: 10
Entry Fee: 1.0 FLOW
```

You should see:
- ✅ Transaction submitted
- ✅ Wallet approval
- ✅ "League created successfully!"
- ✅ Redirect to leagues page

## 💡 Need Help?

See `FIX_TRANSACTION_ERROR.md` for detailed explanation.

---

**Deploy now and your league creation will work!** 🎉
