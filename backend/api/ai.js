const express = require('express');
const axios = require('axios');
const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

// POST request lineup prediction
router.post('/predict-lineup', async (req, res) => {
  try {
    const {
      leagueId,
      playerAddress,
      availablePlayers,
      positions,
      optimizationGoal
    } = req.body;
    
    // Validate
    if (!leagueId || !playerAddress || !availablePlayers || !positions) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Forward request to AI service
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/ai/predict-lineup`,
      {
        leagueId,
        playerAddress,
        availablePlayers,
        positions,
        optimizationGoal: optimizationGoal || 'balanced'
      },
      { timeout: 10000 }
    );
    
    res.json(aiResponse.data);
  } catch (error) {
    console.error('Error calling AI service:', error.message);
    
    // Fallback response if AI service is unavailable
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return res.json({
        success: true,
        lineup: {
          positions: req.body.positions.reduce((acc, pos, idx) => {
            acc[pos] = [req.body.availablePlayers[idx] || 1];
            return acc;
          }, {}),
          expectedScore: 250.0,
          confidence: 0.5,
          rationale: 'AI service unavailable. Using fallback lineup.'
        },
        fallback: true
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'AI service error',
      details: error.message
    });
  }
});

// POST player analysis
router.post('/player-analysis', async (req, res) => {
  try {
    const { playerId } = req.body;
    
    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: 'Missing playerId'
      });
    }
    
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/ai/player-analysis`,
      { playerId },
      { timeout: 5000 }
    );
    
    res.json(aiResponse.data);
  } catch (error) {
    console.error('Error analyzing player:', error.message);
    res.status(500).json({
      success: false,
      error: 'Player analysis failed',
      details: error.message
    });
  }
});

module.exports = router;
