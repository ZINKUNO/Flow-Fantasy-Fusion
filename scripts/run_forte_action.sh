#!/bin/bash
# Execute Forte Action - Stake and Schedule Settlement
# Fresh Code - Built for Forte Hacks

set -e

echo "⚡ Forte Action: Stake and Schedule Settlement"
echo "=============================================="
echo ""

# Check arguments
if [ $# -lt 4 ]; then
    echo "Usage: $0 <leagueId> <stakeAmount> <tokenType> <gameEndTime>"
    echo ""
    echo "Example:"
    echo "  $0 1 25.5 FLOW 1735689600"
    echo ""
    exit 1
fi

LEAGUE_ID=$1
STAKE_AMOUNT=$2
TOKEN_TYPE=$3
GAME_END_TIME=$4

echo "📋 Action Parameters:"
echo "   League ID: $LEAGUE_ID"
echo "   Stake Amount: $STAKE_AMOUNT $TOKEN_TYPE"
echo "   Game End Time: $GAME_END_TIME ($(date -d @$GAME_END_TIME 2>/dev/null || date -r $GAME_END_TIME 2>/dev/null))"
echo ""

# Step 1: Stake tokens
echo "1️⃣  Staking $STAKE_AMOUNT $TOKEN_TYPE for League #$LEAGUE_ID..."
flow transactions send ./transactions/stake_tokens.cdc \
    --arg UInt64:$LEAGUE_ID \
    --arg UFix64:$STAKE_AMOUNT \
    --arg String:$TOKEN_TYPE \
    --network testnet \
    --signer testnet-account

STAKE_TX_ID=$(flow transactions get-last --network testnet | grep "ID" | awk '{print $2}')
echo "✅ Stake transaction submitted: $STAKE_TX_ID"
echo "   View at: https://testnet.flowscan.org/transaction/$STAKE_TX_ID"
echo ""

# Generate unique transaction ID for scheduled settlement
SETTLEMENT_TX_ID="0x$(openssl rand -hex 32)"

# Step 2: Schedule settlement
echo "2️⃣  Scheduling settlement for League #$LEAGUE_ID at time $GAME_END_TIME..."
flow transactions send ./transactions/schedule_settlement.cdc \
    --arg UInt64:$LEAGUE_ID \
    --arg UFix64:$GAME_END_TIME \
    --arg String:$SETTLEMENT_TX_ID \
    --network testnet \
    --signer testnet-account

SCHEDULE_TX_ID=$(flow transactions get-last --network testnet | grep "ID" | awk '{print $2}')
echo "✅ Settlement scheduled: $SCHEDULE_TX_ID"
echo "   View at: https://testnet.flowscan.org/transaction/$SCHEDULE_TX_ID"
echo "   Scheduled TX ID: $SETTLEMENT_TX_ID"
echo ""

echo "🎉 Forte Action completed successfully!"
echo ""
echo "📝 Transaction Links (add to README):"
echo "   Stake: https://testnet.flowscan.org/transaction/$STAKE_TX_ID"
echo "   Schedule: https://testnet.flowscan.org/transaction/$SCHEDULE_TX_ID"
