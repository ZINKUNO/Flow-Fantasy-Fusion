#!/bin/bash

# Direct Contract Deployment Script
echo "🚀 Deploying Flow Fantasy Fusion Contracts (Direct Method)"
echo "==========================================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
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

echo "✅ Configuration loaded"
echo "   Network: testnet"
echo "   Account: $SERVICE_ACCOUNT_ADDRESS"
echo ""

# Check if we're in the right directory
if [ ! -d "contracts" ]; then
    echo "❌ contracts directory not found. Are you in the project root?"
    exit 1
fi

echo "📦 Deploying contracts using flow project deploy..."
echo ""

# Use flow project deploy command which reads from flow.json
flow project deploy --network testnet

echo ""
echo "🎉 Deployment command executed!"
echo ""
echo "📝 Next steps:"
echo "   1. Check your contracts at: https://testnet.flowscan.org/account/$SERVICE_ACCOUNT_ADDRESS"
echo "   2. Update .env with contract addresses (they will be: $SERVICE_ACCOUNT_ADDRESS)"
echo "   3. Test: flow scripts execute scripts/get_all_leagues.cdc --network testnet"
echo ""
