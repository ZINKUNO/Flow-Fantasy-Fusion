const express = require('express');
const router = express.Router();

// POST stake tokens
router.post('/stake', async (req, res) => {
  try {
    const { leagueId, playerAddress, amount, tokenType } = req.body;
    
    // Validate
    if (!leagueId || !playerAddress || !amount || !tokenType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    if (amount <= 0 || amount > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid stake amount'
      });
    }
    
    // In production: Execute stake transaction
    const txId = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    res.json({
      success: true,
      txId,
      leagueId,
      playerAddress,
      amount,
      tokenType,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error staking tokens:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET stake info
router.get('/:leagueId/:playerAddress', async (req, res) => {
  try {
    const { leagueId, playerAddress } = req.params;
    
    // Mock stake data
    const stakeInfo = {
      leagueId: parseInt(leagueId),
      playerAddress,
      stakes: [
        {
          amount: 25.5,
          tokenType: 'FLOW',
          timestamp: Date.now() - 3600000,
          released: false
        }
      ],
      totalStaked: 25.5,
      nftStakes: []
    };
    
    res.json({ success: true, stakeInfo });
  } catch (error) {
    console.error('Error fetching stake info:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST schedule settlement
router.post('/schedule-settlement', async (req, res) => {
  try {
    const { leagueId, scheduledTime } = req.body;
    
    if (!leagueId || !scheduledTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    const txId = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    res.json({
      success: true,
      leagueId,
      scheduledTime,
      txId,
      message: 'Settlement scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling settlement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
