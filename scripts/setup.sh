#!/bin/bash
# Flow Fantasy Fusion - Initial Setup Script
# Fresh Code - Built for Forte Hacks

set -e

echo "🎮 Flow Fantasy Fusion - Setup"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Python $(python3 --version) detected"

# Check Flow CLI
if ! command -v flow &> /dev/null; then
    echo "⚠️  Flow CLI not found. Installing..."
    sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
fi

echo "✅ Flow CLI $(flow version | head -n 1) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

echo "1️⃣  Installing root dependencies..."
npm install
echo ""

echo "2️⃣  Installing frontend dependencies..."
cd frontend && npm install && cd ..
echo ""

echo "3️⃣  Installing backend dependencies..."
cd backend && npm install && cd ..
echo ""

echo "4️⃣  Installing AI service dependencies..."
cd ai && pip3 install -r requirements.txt && cd ..
echo ""

# Setup environment files
echo "🔧 Setting up environment files..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "   ✅ Created .env from template"
    echo "   ⚠️  Please update .env with your Flow testnet credentials"
else
    echo "   ℹ️  .env already exists"
fi

if [ ! -f frontend/.env ]; then
    cat > frontend/.env << EOF
VITE_FLOW_NETWORK=testnet
VITE_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
VITE_FLOW_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn
VITE_API_URL=http://localhost:3001
EOF
    echo "   ✅ Created frontend/.env"
else
    echo "   ℹ️  frontend/.env already exists"
fi

if [ ! -f backend/.env ]; then
    cat > backend/.env << EOF
PORT=3001
NODE_ENV=development
FLOW_NETWORK=testnet
AI_SERVICE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
EOF
    echo "   ✅ Created backend/.env"
else
    echo "   ℹ️  backend/.env already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Update .env with your Flow testnet account credentials"
echo "   2. Run 'bash scripts/deploy_contracts.sh' to deploy contracts"
echo "   3. Run 'npm run dev:backend' to start the backend API"
echo "   4. Run 'npm run dev:ai' to start the AI service"
echo "   5. Run 'npm run dev:frontend' to start the frontend"
echo ""
echo "📚 For more information, see README.md"
