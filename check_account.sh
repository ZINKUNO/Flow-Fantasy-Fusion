#!/bin/bash

# Check Account Status
echo "🔍 Checking Flow Testnet Account Status"
echo "========================================"
echo ""

# Load environment
export $(cat .env | grep -v '^#' | xargs)

echo "Account: $SERVICE_ACCOUNT_ADDRESS"
echo ""
echo "Fetching account info..."
echo ""

# Get account info
flow accounts get $SERVICE_ACCOUNT_ADDRESS --network testnet 2>&1 | grep -v "Version warning"

echo ""
echo "🌐 View on Explorer:"
echo "https://testnet.flowscan.org/account/$SERVICE_ACCOUNT_ADDRESS"
echo ""
