# 🏀 League Creation - Complete Guide

## ✅ What Was Fixed

Your league creation functionality is now **fully functional**! Here's what was updated:

### Backend Changes
1. ✅ Added `createLeague()` method to `flowService.js`
2. ✅ Fixed API endpoint in `leagues.js` to handle creation
3. ✅ Proper error handling and validation

### Frontend Changes
1. ✅ Updated `CreateLeague.jsx` to use FCL directly
2. ✅ Added proper Cadence transaction for league creation
3. ✅ Improved error messages and user feedback
4. ✅ Added transaction status tracking

### Smart Contract Integration
1. ✅ Created Cadence transaction file
2. ✅ Proper storage initialization
3. ✅ Correct parameter types and formatting

## 🚀 How to Use

### Step 1: Start Your Services

```bash
# Terminal 1 - Backend
cd backend/
npm start

# Terminal 2 - Frontend  
cd frontend/
npm run dev
```

### Step 2: Connect Your Wallet

1. Open `http://localhost:3000` (or your frontend URL)
2. Click "Connect Wallet" in the header
3. Choose your Flow wallet (Blocto, Lilico, etc.)
4. Approve the connection

### Step 3: Create a League

1. Navigate to "Create League" page
2. Fill in the form:
   - **League Name**: e.g., "NBA Finals Fantasy"
   - **Description**: e.g., "Compete with NBA Top Shot moments"
   - **Start Time**: Choose a future date/time
   - **End Time**: Choose an end date/time
   - **Min Players**: e.g., 4
   - **Max Players**: e.g., 20
   - **Entry Fee**: e.g., 10 FLOW
   - **Max Stake Per User**: e.g., 1000 FLOW
   - **Allow NFTs**: Check if you want NFT staking

3. Click "Create League"
4. **Approve the transaction** in your wallet popup
5. Wait for confirmation (usually 10-30 seconds)
6. You'll be redirected to the leagues page

## 📋 Transaction Details

### What Happens When You Create a League

```
1. Frontend validates form data
   ↓
2. Converts dates to Unix timestamps
   ↓
3. Creates Cadence transaction with parameters
   ↓
4. Sends transaction to Flow blockchain via FCL
   ↓
5. Wallet popup appears for user approval
   ↓
6. User approves transaction
   ↓
7. Transaction is submitted to blockchain
   ↓
8. Wait for transaction to be sealed (confirmed)
   ↓
9. League is created on-chain
   ↓
10. User is redirected to leagues page
```

### Transaction Parameters

The transaction sends these parameters to the blockchain:

```javascript
{
  name: String,              // League name
  description: String,       // League description
  startTime: UFix64,        // Unix timestamp (seconds)
  endTime: UFix64,          // Unix timestamp (seconds)
  minPlayers: UInt32,       // Minimum players (2-100)
  maxPlayers: UInt32,       // Maximum players (2-100)
  entryFee: UFix64,         // Entry fee in FLOW
  allowedTokens: [String],  // ["FLOW", "FUSD"]
  allowNFTs: Bool,          // true/false
  maxStakePerUser: UFix64   // Maximum stake per user
}
```

## 🐛 Troubleshooting

### Error: "Please connect your wallet first"
**Solution:** Click "Connect Wallet" in the header and approve the connection.

### Error: "Transaction failed"
**Possible causes:**
1. **Insufficient FLOW balance** - You need FLOW for gas fees
2. **Invalid dates** - Make sure end time is after start time
3. **Network issues** - Check your internet connection

**Solutions:**
- Check your FLOW balance (need at least 0.001 FLOW for gas)
- Verify date/time values are correct
- Try again in a few seconds

### Error: "Could not borrow league collection"
**Solution:** This is usually a contract deployment issue. Make sure:
1. Contracts are deployed to testnet
2. Contract address is correct (`0xf474649aaa285cf5`)
3. You're connected to Flow testnet

### Transaction Pending Forever
**Solution:**
1. Check Flow testnet status: https://status.onflow.org/
2. View transaction on Flowscan: https://testnet.flowscan.org/
3. If stuck, refresh page and try again

## 📊 Verifying Your League

### Method 1: Frontend
1. Go to "Browse Leagues" page
2. Your league should appear in the list
3. Click on it to see details

### Method 2: Flowscan
1. Go to https://testnet.flowscan.org/
2. Search for your wallet address
3. View recent transactions
4. Find the "Create League" transaction

### Method 3: Flow CLI
```bash
# Get all leagues
flow scripts execute scripts/get_all_leagues.cdc --network testnet

# Get specific league
flow scripts execute scripts/get_league.cdc <league_id> --network testnet
```

## 💡 Tips for Success

### Best Practices
1. **Test with small values first** - Use low entry fees for testing
2. **Set reasonable dates** - Start time should be at least 1 hour in the future
3. **Check your balance** - Ensure you have enough FLOW for gas fees
4. **Wait for confirmation** - Don't refresh during transaction processing

### Recommended Settings for Testing
```
Name: "Test League"
Description: "Testing league creation"
Start Time: 1 hour from now
End Time: 24 hours from now
Min Players: 2
Max Players: 10
Entry Fee: 1.0 FLOW
Max Stake Per User: 100.0 FLOW
Allow NFTs: true
```

## 🔧 Advanced Configuration

### Custom Token Support
To add custom tokens, update the `allowedTokens` array:
```javascript
allowedTokens: ['FLOW', 'FUSD', 'USDC']
```

### NFT Staking
Enable NFT staking by checking the "Allow NFT Staking" checkbox. This allows users to stake NBA Top Shot moments or other NFTs.

### Player Limits
- **Min Players**: Minimum required to start the league
- **Max Players**: Maximum allowed participants
- Range: 2-100 players

### Stake Limits
- **Entry Fee**: Required stake to join (in FLOW)
- **Max Stake Per User**: Maximum a single user can stake
- Prevents whales from dominating

## 📝 Example: Creating a Real League

Let's create a real NBA fantasy league:

```
League Name: "NBA All-Star Weekend 2025"
Description: "Compete with your favorite NBA moments during All-Star Weekend. Top 3 winners split the prize pool!"

Start Time: February 16, 2025, 6:00 PM EST
End Time: February 18, 2025, 11:59 PM EST

Min Players: 10
Max Players: 50
Entry Fee: 25.0 FLOW
Max Stake Per User: 500.0 FLOW
Allow NFTs: ✓ (checked)
```

**Expected Prize Pool**: 10-50 players × 25 FLOW = 250-1,250 FLOW

**Prize Distribution**:
- 1st Place: 60% (150-750 FLOW)
- 2nd Place: 25% (62.5-312.5 FLOW)
- 3rd Place: 15% (37.5-187.5 FLOW)

## 🎯 Testing Checklist

Before your demo, test these scenarios:

- [ ] Connect wallet successfully
- [ ] Fill out league creation form
- [ ] Submit transaction
- [ ] Approve in wallet popup
- [ ] Wait for confirmation
- [ ] See league in leagues list
- [ ] View league details
- [ ] Check transaction on Flowscan

## 🚨 Common Mistakes to Avoid

1. ❌ **Not connecting wallet** - Always connect first
2. ❌ **Invalid dates** - End time must be after start time
3. ❌ **Zero values** - Entry fee and max stake must be > 0
4. ❌ **Refreshing during transaction** - Wait for confirmation
5. ❌ **Wrong network** - Make sure you're on testnet

## 📞 Need Help?

### Check These First
1. **Console logs** - Open browser DevTools (F12) and check Console tab
2. **Network tab** - Check for failed API calls
3. **Wallet popup** - Make sure it's not blocked by browser

### Debug Commands
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check if contracts are deployed
flow accounts get 0xf474649aaa285cf5 --network testnet

# View recent transactions
# Go to: https://testnet.flowscan.org/account/YOUR_ADDRESS
```

## 🎉 Success!

Once you see "League created successfully!" you're done! Your league is now live on the Flow blockchain and ready for players to join.

### Next Steps
1. Share the league with friends
2. Wait for players to join
3. Submit your lineup
4. Let AI suggest optimal picks
5. Watch the automated settlement

---

**Your league creation is now fully functional!** 🚀

If you encounter any issues, check the console logs and verify all services are running.
