#!/bin/bash

# Simple Contract Deployment Script
echo "🚀 Deploying Flow Fantasy Fusion Contracts"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with:"
    echo "  TESTNET_PRIVATE_KEY=your_private_key"
    echo "  SERVICE_ACCOUNT_ADDRESS=0xYOUR_ADDRESS"
    exit 1
fi

# Load environment
export $(cat .env | grep -v '^#' | xargs)

# Check required variables
if [ -z "$TESTNET_PRIVATE_KEY" ]; then
    echo "❌ TESTNET_PRIVATE_KEY not set in .env"
    exit 1
fi

if [ -z "$SERVICE_ACCOUNT_ADDRESS" ]; then
    echo "❌ SERVICE_ACCOUNT_ADDRESS not set in .env"
    exit 1
fi

# Update flow.json with actual address
sed -i "s/SERVICE_ACCOUNT_ADDRESS/$SERVICE_ACCOUNT_ADDRESS/g" flow.json

echo "✅ Configuration loaded"
echo "   Network: testnet"
echo "   Account: $SERVICE_ACCOUNT_ADDRESS"
echo ""

# Try to deploy contracts
echo "📦 Deploying contracts..."
echo ""

# Deploy LeagueFactory
echo "1️⃣  Deploying LeagueFactory..."
if flow accounts add-contract LeagueFactory contracts/LeagueFactory.cdc --network testnet --signer testnet-account 2>/dev/null; then
    echo "✅ LeagueFactory deployed"
else
    echo "⚠️  Updating LeagueFactory..."
    flow accounts update-contract LeagueFactory contracts/LeagueFactory.cdc --network testnet --signer testnet-account || echo "❌ Failed to deploy LeagueFactory"
fi
echo ""

# Deploy StakingManager
echo "2️⃣  Deploying StakingManager..."
if flow accounts add-contract StakingManager contracts/StakingManager.cdc --network testnet --signer testnet-account 2>/dev/null; then
    echo "✅ StakingManager deployed"
else
    echo "⚠️  Updating StakingManager..."
    flow accounts update-contract StakingManager contracts/StakingManager.cdc --network testnet --signer testnet-account || echo "❌ Failed to deploy StakingManager"
fi
echo ""

# Deploy Settlement
echo "3️⃣  Deploying Settlement..."
if flow accounts add-contract Settlement contracts/Settlement.cdc --network testnet --signer testnet-account 2>/dev/null; then
    echo "✅ Settlement deployed"
else
    echo "⚠️  Updating Settlement..."
    flow accounts update-contract Settlement contracts/Settlement.cdc --network testnet --signer testnet-account || echo "❌ Failed to deploy Settlement"
fi
echo ""

echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Check your contracts at: https://testnet.flowscan.org/account/$SERVICE_ACCOUNT_ADDRESS"
echo "   2. Update .env with contract addresses"
echo "   3. Run: flow scripts execute scripts/get_all_leagues.cdc --network testnet"
echo ""
