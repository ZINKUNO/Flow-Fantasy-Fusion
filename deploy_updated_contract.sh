#!/bin/bash

# Deploy Updated LeagueFactory Contract
# This script redeploys the contract with the new createLeaguePublic function

echo "🚀 Deploying Updated LeagueFactory Contract"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contract details
CONTRACT_NAME="LeagueFactory"
CONTRACT_FILE="contracts/LeagueFactory.cdc"
ACCOUNT_ADDRESS="0xf474649aaa285cf5"

echo "📋 Contract Details:"
echo "  Name: $CONTRACT_NAME"
echo "  File: $CONTRACT_FILE"
echo "  Account: $ACCOUNT_ADDRESS"
echo ""

# Check if Flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo -e "${RED}❌ Flow CLI not installed${NC}"
    echo "Install from: https://developers.flow.com/tools/flow-cli/install"
    exit 1
fi

echo -e "${GREEN}✓ Flow CLI found${NC}"
echo ""

# Check if contract file exists
if [ ! -f "$CONTRACT_FILE" ]; then
    echo -e "${RED}❌ Contract file not found: $CONTRACT_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Contract file found${NC}"
echo ""

# Check if .env file exists with private key
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Create .env with your TESTNET_PRIVATE_KEY"
    exit 1
fi

# Load environment variables
source .env

if [ -z "$TESTNET_PRIVATE_KEY" ]; then
    echo -e "${RED}❌ TESTNET_PRIVATE_KEY not set in .env${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Private key loaded${NC}"
echo ""

echo "⚠️  ${YELLOW}WARNING:${NC} This will update the contract on Flow Testnet"
echo "Make sure you have the correct private key for account $ACCOUNT_ADDRESS"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "🔄 Deploying contract..."
echo ""

# Deploy the contract
flow accounts update-contract \
    $CONTRACT_NAME \
    $CONTRACT_FILE \
    --signer testnet-account \
    --network testnet \
    --yes

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Contract deployed successfully!${NC}"
    echo ""
    echo "📍 Contract Address: $ACCOUNT_ADDRESS"
    echo "🔗 View on Flowscan: https://testnet.flowscan.org/contract/A.${ACCOUNT_ADDRESS:2}.$CONTRACT_NAME"
    echo ""
    echo "✨ Next steps:"
    echo "1. Test league creation in your frontend"
    echo "2. Verify the transaction on Flowscan"
    echo "3. Check that leagues are created successfully"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Deployment failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check that your private key is correct"
    echo "2. Verify you have FLOW for gas fees"
    echo "3. Make sure the contract syntax is valid"
    echo "4. Check Flow testnet status: https://status.onflow.org/"
    echo ""
    exit 1
fi
