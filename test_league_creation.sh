#!/bin/bash

# Flow Fantasy Fusion - League Creation Test Script
# This script verifies that all components are ready for league creation

echo "🏀 Flow Fantasy Fusion - League Creation Test"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    
    echo -n "Testing $name... "
    
    if curl -s -f -o /dev/null "$url"; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

# Test 1: Backend Health
echo "📡 Testing Backend..."
test_endpoint "Backend API" "http://localhost:3001/api/health"
test_endpoint "Leagues Endpoint" "http://localhost:3001/api/leagues"
echo ""

# Test 2: Frontend
echo "🌐 Testing Frontend..."
if curl -s -f -o /dev/null "http://localhost:3000"; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Frontend is not running${NC}"
    echo "  Start with: cd frontend && npm run dev"
    ((FAILED++))
fi
echo ""

# Test 3: Contract Addresses
echo "🔗 Testing Contract Configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    ((PASSED++))
    
    # Check for contract addresses
    if grep -q "CONTRACT_LEAGUE_FACTORY" .env; then
        echo -e "${GREEN}✓ LeagueFactory address configured${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ LeagueFactory address not set${NC}"
    fi
else
    echo -e "${RED}✗ .env file not found${NC}"
    echo "  Copy from .env.example"
    ((FAILED++))
fi
echo ""

# Test 4: Flow CLI
echo "⚡ Testing Flow CLI..."
if command -v flow &> /dev/null; then
    echo -e "${GREEN}✓ Flow CLI installed${NC}"
    ((PASSED++))
    
    # Test Flow network connection
    if flow accounts get 0xf474649aaa285cf5 --network testnet &> /dev/null; then
        echo -e "${GREEN}✓ Can connect to Flow testnet${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Cannot connect to Flow testnet${NC}"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠ Flow CLI not installed (optional)${NC}"
fi
echo ""

# Test 5: Node modules
echo "📦 Testing Dependencies..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Backend dependencies missing${NC}"
    echo "  Run: cd backend && npm install"
    ((FAILED++))
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Frontend dependencies missing${NC}"
    echo "  Run: cd frontend && npm install"
    ((FAILED++))
fi
echo ""

# Test 6: AI Service (optional)
echo "🤖 Testing AI Service..."
if curl -s -f -o /dev/null "http://localhost:5001/health"; then
    echo -e "${GREEN}✓ AI Service is running${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ AI Service not running (optional)${NC}"
    echo "  Start with: cd ai && ./start_gemini.sh"
fi
echo ""

# Summary
echo "=============================================="
echo "📊 Test Summary"
echo "=============================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical tests passed!${NC}"
    echo ""
    echo "✅ You're ready to create leagues!"
    echo ""
    echo "Next steps:"
    echo "1. Open http://localhost:3000"
    echo "2. Connect your Flow wallet"
    echo "3. Navigate to 'Create League'"
    echo "4. Fill out the form and submit"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    echo ""
    echo "Please fix the issues above before creating leagues."
    echo ""
    echo "Quick fixes:"
    echo "• Backend not running? → cd backend && npm start"
    echo "• Frontend not running? → cd frontend && npm run dev"
    echo "• Missing .env? → cp .env.example .env"
    echo "• Missing dependencies? → npm install in backend/ and frontend/"
    echo ""
    exit 1
fi
