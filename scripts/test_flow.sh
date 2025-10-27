#!/bin/bash
# Flow Fantasy Fusion - Integration Testing Script
# Fresh Code - Built for Forte Hacks

set -e

echo "🧪 Flow Fantasy Fusion - Integration Tests"
echo "=========================================="
echo ""

# Start emulator in background
echo "1️⃣  Starting Flow emulator..."
flow emulator start &
EMULATOR_PID=$!
sleep 5

# Deploy contracts to emulator
echo "2️⃣  Deploying contracts to emulator..."
flow project deploy --network emulator

# Run test scenario
echo ""
echo "3️⃣  Running test scenario..."
echo ""

# Create a league
echo "   📝 Creating test league..."
flow transactions send ./transactions/create_league.cdc \
    --arg String:"Test League" \
    --arg String:"Integration test league" \
    --arg UFix64:$(date -d '+1 day' +%s 2>/dev/null || echo "1735689600") \
    --arg UFix64:$(date -d '+7 days' +%s 2>/dev/null || echo "1736294400") \
    --arg UInt32:2 \
    --arg UInt32:10 \
    --arg UFix64:5.0 \
    --arg [String,String]:FLOW,FUSD \
    --arg Bool:true \
    --arg UFix64:1000.0 \
    --network emulator \
    --signer emulator-account

echo "   ✅ League created"
echo ""

# Stake tokens
echo "   💰 Staking tokens..."
flow transactions send ./transactions/stake_tokens.cdc \
    --arg UInt64:1 \
    --arg UFix64:10.0 \
    --arg String:FLOW \
    --network emulator \
    --signer emulator-account

echo "   ✅ Tokens staked"
echo ""

# Submit lineup
echo "   📋 Submitting lineup..."
flow transactions send ./transactions/submit_lineup.cdc \
    --arg UInt64:1 \
    --arg {String:[UInt64]}:'{"PG":[1],"SG":[2],"SF":[3],"PF":[4],"C":[5]}' \
    --arg Bool:true \
    --network emulator \
    --signer emulator-account

echo "   ✅ Lineup submitted"
echo ""

# Schedule settlement
echo "   ⏰ Scheduling settlement..."
flow transactions send ./transactions/schedule_settlement.cdc \
    --arg UInt64:1 \
    --arg UFix64:$(date -d '+7 days' +%s 2>/dev/null || echo "1736294400") \
    --arg String:"0xTEST123" \
    --network emulator \
    --signer emulator-account

echo "   ✅ Settlement scheduled"
echo ""

echo "🎉 All tests passed!"
echo ""

# Cleanup
echo "🧹 Cleaning up..."
kill $EMULATOR_PID
echo "   ✅ Emulator stopped"
echo ""

echo "✨ Integration testing complete!"
