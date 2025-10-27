#!/bin/bash
# Flow Fantasy Fusion - Contract Deployment Script
# Fresh Code - Built for Forte Hacks

set -e

echo "🚀 Flow Fantasy Fusion - Contract Deployment"
echo "============================================"
echo ""

# Check if Flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo "❌ Flow CLI not found. Please install it first:"
    echo "   sh -ci \"\$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)\""
    exit 1
fi

# Check for environment variables
if [ -z "$TESTNET_PRIVATE_KEY" ]; then
    echo "⚠️  TESTNET_PRIVATE_KEY not set. Please set it in .env file."
    echo "   You can generate a testnet account at: https://testnet-faucet.onflow.org/"
    exit 1
fi

echo "📋 Deployment Configuration:"
echo "   Network: testnet"
echo "   Account: ${SERVICE_ACCOUNT_ADDRESS:-'Not set'}"
echo ""

# Deploy to testnet
echo "📦 Deploying contracts to Flow testnet..."
echo ""

echo "1️⃣  Deploying LeagueFactory..."
flow accounts add-contract LeagueFactory ./contracts/LeagueFactory.cdc \
    --network testnet \
    --signer testnet-account || {
        echo "⚠️  LeagueFactory might already exist, updating..."
        flow accounts update-contract LeagueFactory ./contracts/LeagueFactory.cdc \
            --network testnet \
            --signer testnet-account
    }
echo "✅ LeagueFactory deployed"
echo ""

echo "2️⃣  Deploying StakingManager..."
flow accounts add-contract StakingManager ./contracts/StakingManager.cdc \
    --network testnet \
    --signer testnet-account || {
        echo "⚠️  StakingManager might already exist, updating..."
        flow accounts update-contract StakingManager ./contracts/StakingManager.cdc \
            --network testnet \
            --signer testnet-account
    }
echo "✅ StakingManager deployed"
echo ""

echo "3️⃣  Deploying Settlement..."
flow accounts add-contract Settlement ./contracts/Settlement.cdc \
    --network testnet \
    --signer testnet-account || {
        echo "⚠️  Settlement might already exist, updating..."
        flow accounts update-contract Settlement ./contracts/Settlement.cdc \
            --network testnet \
            --signer testnet-account
    }
echo "✅ Settlement deployed"
echo ""

echo "🎉 All contracts deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Note your contract addresses from the output above"
echo "   2. Update .env with CONTRACT_LEAGUE_FACTORY, CONTRACT_STAKING_MANAGER, CONTRACT_SETTLEMENT"
echo "   3. Update frontend/.env with the same addresses"
echo "   4. Check deployed contracts at: https://testnet.flowscan.org/account/${SERVICE_ACCOUNT_ADDRESS}"
echo ""
echo "🔗 Testnet Explorer: https://testnet.flowscan.org/"
