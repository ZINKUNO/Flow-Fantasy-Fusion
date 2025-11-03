const express = require('express');
const router = express.Router();
const flowService = require('../services/flowService');

// POST stake tokens - Returns transaction for frontend to execute
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
    
    // Get transaction code from FlowService
    const txData = await flowService.joinLeague(leagueId, playerAddress, amount);
    
    res.json({
      success: true,
      transaction: txData.transaction,
      args: txData.args,
      leagueId,
      playerAddress,
      amount,
      tokenType,
      timestamp: Date.now(),
      message: 'Transaction ready - execute from frontend with user wallet'
    });
  } catch (error) {
    console.error('Error preparing stake transaction:', error);
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

// POST schedule settlement - Returns transaction for frontend to execute
router.post('/schedule-settlement', async (req, res) => {
  try {
    const { leagueId, scheduledTime, winners } = req.body;
    
    if (!leagueId || !winners) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields (leagueId, winners)'
      });
    }
    
    // Get transaction code from FlowService
    const txData = await flowService.scheduleSettlement(leagueId, scheduledTime, winners);
    
    res.json({
      success: true,
      transaction: txData.transaction,
      args: txData.args,
      leagueId,
      scheduledTime,
      winners,
      message: 'Settlement transaction ready - execute from frontend with admin wallet'
    });
  } catch (error) {
    console.error('Error preparing settlement transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
