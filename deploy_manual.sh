#!/bin/bash

# Manual Contract Deployment Script - Most Direct Approach
echo "🚀 Manual Contract Deployment"
echo "=============================="
echo ""

# Load environment
export $(cat .env | grep -v '^#' | xargs)

echo "✅ Account: $SERVICE_ACCOUNT_ADDRESS"
echo ""

# Deploy contracts one by one with full paths
echo "1️⃣  Deploying LeagueFactory..."
cd /home/arpit/Desktop/hackathon_projects/Flow_Fantasy_Fusion
flow accounts add-contract LeagueFactory "$(pwd)/contracts/LeagueFactory.cdc" \
    --network testnet \
    --signer testnet-account 2>&1 | grep -v "Version warning" || {
    echo "   Trying update instead..."
    flow accounts update-contract LeagueFactory "$(pwd)/contracts/LeagueFactory.cdc" \
        --network testnet \
        --signer testnet-account 2>&1 | grep -v "Version warning"
}
echo ""

echo "2️⃣  Deploying StakingManager..."
flow accounts add-contract StakingManager "$(pwd)/contracts/StakingManager.cdc" \
    --network testnet \
    --signer testnet-account 2>&1 | grep -v "Version warning" || {
    echo "   Trying update instead..."
    flow accounts update-contract StakingManager "$(pwd)/contracts/StakingManager.cdc" \
        --network testnet \
        --signer testnet-account 2>&1 | grep -v "Version warning"
}
echo ""

echo "3️⃣  Deploying Settlement..."
flow accounts add-contract Settlement "$(pwd)/contracts/Settlement.cdc" \
    --network testnet \
    --signer testnet-account 2>&1 | grep -v "Version warning" || {
    echo "   Trying update instead..."
    flow accounts update-contract Settlement "$(pwd)/contracts/Settlement.cdc" \
        --network testnet \
        --signer testnet-account 2>&1 | grep -v "Version warning"
}
echo ""

echo "🎉 Deployment complete!"
echo ""
echo "🔍 Verify at: https://testnet.flowscan.org/account/$SERVICE_ACCOUNT_ADDRESS"
echo ""
