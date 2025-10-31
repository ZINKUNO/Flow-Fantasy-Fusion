#!/bin/bash

# Production Deployment Script for Flow Fantasy Fusion
# This script automates the complete production deployment process

set -e  # Exit on any error

echo "🚀 Flow Fantasy Fusion - Production Deployment"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python not found. Please install Python 3.8+${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Python found: $(python3 --version)${NC}"
    
    # Check Flow CLI
    if ! command -v flow &> /dev/null; then
        echo -e "${RED}❌ Flow CLI not found. Please install Flow CLI${NC}"
        echo "Install: sh -ci \"\$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)\""
        exit 1
    fi
    echo -e "${GREEN}✓ Flow CLI found: $(flow version)${NC}"
    
    # Check .env file
    if [ ! -f .env ]; then
        echo -e "${RED}❌ .env file not found${NC}"
        echo "Please copy .env.example to .env and configure it"
        exit 1
    fi
    echo -e "${GREEN}✓ .env file found${NC}"
    
    echo ""
}

# Load environment variables
load_env() {
    echo "📦 Loading environment variables..."
    export $(cat .env | grep -v '^#' | xargs)
    
    if [ -z "$TESTNET_PRIVATE_KEY" ]; then
        echo -e "${RED}❌ TESTNET_PRIVATE_KEY not set in .env${NC}"
        exit 1
    fi
    
    if [ -z "$SERVICE_ACCOUNT_ADDRESS" ]; then
        echo -e "${RED}❌ SERVICE_ACCOUNT_ADDRESS not set in .env${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Environment variables loaded${NC}"
    echo ""
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Root dependencies
    echo "Installing root dependencies..."
    npm install
    
    # Backend dependencies
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    # Frontend dependencies
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    # AI service dependencies
    echo "Installing AI service dependencies..."
    cd ai && pip3 install -r requirements.txt && cd ..
    
    echo -e "${GREEN}✓ All dependencies installed${NC}"
    echo ""
}

# Deploy contracts to Flow testnet
deploy_contracts() {
    echo "🔗 Deploying contracts to Flow testnet..."
    
    # Run deployment script
    bash scripts/deploy_contracts.sh
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Contracts deployed successfully${NC}"
    else
        echo -e "${RED}❌ Contract deployment failed${NC}"
        exit 1
    fi
    
    echo ""
}

# Verify contract deployment
verify_deployment() {
    echo "🔍 Verifying contract deployment..."
    
    # Test league query
    echo "Testing league query..."
    flow scripts execute scripts/get_all_leagues.cdc --network testnet
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Contracts verified on testnet${NC}"
    else
        echo -e "${YELLOW}⚠ Contract verification returned no data (might be empty)${NC}"
    fi
    
    echo ""
}

# Build frontend
build_frontend() {
    echo "🏗️  Building frontend..."
    
    cd frontend
    
    # Create production .env
    cat > .env.production << EOF
VITE_FLOW_NETWORK=testnet
VITE_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
VITE_API_URL=${BACKEND_URL:-http://localhost:3001}
VITE_CONTRACT_LEAGUE_FACTORY=${CONTRACT_LEAGUE_FACTORY}
VITE_CONTRACT_STAKING_MANAGER=${CONTRACT_STAKING_MANAGER}
VITE_CONTRACT_SETTLEMENT=${CONTRACT_SETTLEMENT}
EOF
    
    # Build
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend built successfully${NC}"
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
    
    cd ..
    echo ""
}

# Test backend locally
test_backend() {
    echo "🧪 Testing backend locally..."
    
    cd backend
    
    # Start backend in background
    NODE_ENV=production node index.js &
    BACKEND_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Test health endpoint
    if curl -s http://localhost:3001/api/health | grep -q "ok"; then
        echo -e "${GREEN}✓ Backend health check passed${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
        kill $BACKEND_PID
        exit 1
    fi
    
    # Stop backend
    kill $BACKEND_PID
    
    cd ..
    echo ""
}

# Generate deployment report
generate_report() {
    echo "📊 Generating deployment report..."
    
    REPORT_FILE="deployment_report_$(date +%Y%m%d_%H%M%S).txt"
    
    cat > $REPORT_FILE << EOF
Flow Fantasy Fusion - Deployment Report
Generated: $(date)

========================================
DEPLOYMENT INFORMATION
========================================

Network: Flow Testnet
Service Account: ${SERVICE_ACCOUNT_ADDRESS}

Contract Addresses:
- LeagueFactory: ${CONTRACT_LEAGUE_FACTORY}
- StakingManager: ${CONTRACT_STAKING_MANAGER}
- Settlement: ${CONTRACT_SETTLEMENT}

Explorer Links:
- Account: https://testnet.flowscan.org/account/${SERVICE_ACCOUNT_ADDRESS}
- LeagueFactory: https://testnet.flowscan.org/contract/A.${CONTRACT_LEAGUE_FACTORY}.LeagueFactory
- StakingManager: https://testnet.flowscan.org/contract/A.${CONTRACT_STAKING_MANAGER}.StakingManager
- Settlement: https://testnet.flowscan.org/contract/A.${CONTRACT_SETTLEMENT}.Settlement

========================================
DEPLOYMENT CHECKLIST
========================================

Smart Contracts:
[✓] LeagueFactory deployed
[✓] StakingManager deployed
[✓] Settlement deployed
[✓] Contracts verified on testnet

Backend:
[✓] Dependencies installed
[✓] Environment configured
[✓] Health check passed
[ ] Deployed to cloud (manual step)

Frontend:
[✓] Dependencies installed
[✓] Production build created
[✓] Environment configured
[ ] Deployed to Vercel/Netlify (manual step)

AI Service:
[✓] Dependencies installed
[ ] Deployed to Render (manual step)

========================================
NEXT STEPS
========================================

1. Deploy Backend:
   - Use Railway: railway up
   - Or Render: Connect GitHub repo

2. Deploy AI Service:
   - Use Render: Connect GitHub repo
   - Set PORT=5000 in environment

3. Deploy Frontend:
   - Use Vercel: vercel --prod
   - Or Netlify: netlify deploy --prod --dir=frontend/dist

4. Update DNS (if using custom domain)

5. Test end-to-end:
   - Connect wallet
   - Create test league
   - Verify on testnet explorer

========================================
SUPPORT
========================================

- Flow Discord: https://discord.gg/flow
- Documentation: See README.md
- Testnet Faucet: https://testnet-faucet.onflow.org/

EOF

    echo -e "${GREEN}✓ Deployment report generated: $REPORT_FILE${NC}"
    echo ""
    cat $REPORT_FILE
}

# Main deployment flow
main() {
    check_prerequisites
    load_env
    
    echo "🎯 Starting production deployment..."
    echo ""
    
    # Install dependencies
    install_dependencies
    
    # Deploy contracts
    deploy_contracts
    
    # Verify deployment
    verify_deployment
    
    # Build frontend
    build_frontend
    
    # Test backend
    test_backend
    
    # Generate report
    generate_report
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}🎉 Production deployment complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "📝 Next steps:"
    echo "1. Deploy backend to Railway/Render"
    echo "2. Deploy AI service to Render"
    echo "3. Deploy frontend to Vercel/Netlify"
    echo "4. Test end-to-end functionality"
    echo ""
    echo "📄 See deployment_report_*.txt for details"
    echo ""
}

# Run main function
main
