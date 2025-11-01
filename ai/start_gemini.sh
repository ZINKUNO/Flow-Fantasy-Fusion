#!/bin/bash

# Flow Fantasy Fusion - Gemini AI Service Startup Script
# This script starts the Gemini-powered AI chat service

echo "🚀 Starting Flow Fantasy Fusion AI Service (Gemini)"
echo "=================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "❗ IMPORTANT: Please edit .env and add your GEMINI_API_KEY"
    echo "Get your API key from: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "Press Enter after you've added your API key to .env..."
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ ERROR: GEMINI_API_KEY is not set in .env file"
    echo "Please add your Gemini API key to the .env file"
    exit 1
fi

echo "✅ Gemini API key configured"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""
echo "🌟 Starting Gemini AI Chat Service..."
echo "📡 Service will be available at: http://localhost:5001"
echo "📚 API docs at: http://localhost:5001/docs"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

# Start the service
python gemini_app.py
