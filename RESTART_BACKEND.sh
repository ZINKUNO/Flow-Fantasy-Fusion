#!/bin/bash

echo "🔄 Restarting Backend with Updated Configuration"
echo "================================================"

# Kill existing backend processes
echo "Stopping existing backend..."
pkill -f "node.*backend" 2>/dev/null || true
sleep 2

# Navigate to backend directory
cd backend

# Start backend
echo "Starting backend with new environment variables..."
npm start

echo "✅ Backend restarted!"
echo "API available at: http://localhost:3001"
