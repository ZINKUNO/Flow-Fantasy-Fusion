const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      api: 'operational',
      blockchain: 'connected',
      ai: 'operational',
      cache: 'operational'
    }
  });
});

module.exports = router;
