/**
 * Flow Fantasy Fusion - Backend API
 * Fresh Code - Built for Forte Hacks
 * 
 * Integrates Flow blockchain, AI predictions, and external data sources
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

// Route imports
const leagueRoutes = require('./api/leagues');
const stakingRoutes = require('./api/staking');
const aiRoutes = require('./api/ai');
const dataRoutes = require('./api/data');
const healthRoutes = require('./api/health');

const app = express();
const PORT = process.env.PORT || 3001;

// Cache configuration (5 minute TTL)
const cache = new NodeCache({ stdTTL: 300 });

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Make cache available to routes
app.set('cache', cache);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/data', dataRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Flow Fantasy Fusion API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: '/api/health',
      leagues: '/api/leagues',
      staking: '/api/staking',
      ai: '/api/ai',
      data: '/api/data'
    },
    documentation: 'https://github.com/flow-fantasy-fusion/flow-fantasy-fusion#api-docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Flow Fantasy Fusion API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Flow Network: ${process.env.FLOW_NETWORK || 'testnet'}`);
});

module.exports = app;
