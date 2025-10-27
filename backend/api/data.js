const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock data providers (Find Labs, Dapper)
// In production: Replace with actual API calls

// GET player data from external sources
router.get('/players', async (req, res) => {
  try {
    const { sport, limit } = req.query;
    
    // Mock player data
    const players = Array.from({ length: parseInt(limit) || 10 }, (_, i) => ({
      playerId: i + 1,
      name: `Player ${i + 1}`,
      position: ['PG', 'SG', 'SF', 'PF', 'C'][i % 5],
      team: ['Lakers', 'Warriors', 'Celtics', 'Heat'][i % 4],
      stats: {
        points: Math.floor(Math.random() * 30) + 10,
        rebounds: Math.floor(Math.random() * 12) + 3,
        assists: Math.floor(Math.random() * 10) + 2
      },
      nftId: i + 100,
      marketValue: Math.floor(Math.random() * 1000) + 50
    }));
    
    res.json({ success: true, players });
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET NFT metadata
router.get('/nft/:nftId', async (req, res) => {
  try {
    const { nftId } = req.params;
    
    // Mock NFT data
    const nft = {
      nftId: parseInt(nftId),
      collection: 'NBA Top Shot',
      name: `Moment #${nftId}`,
      player: 'LeBron James',
      play: 'Three-Pointer',
      rarity: 'Legendary',
      serialNumber: Math.floor(Math.random() * 1000) + 1,
      marketValue: Math.floor(Math.random() * 5000) + 100,
      imageUrl: `https://assets.nbatopshot.com/editions/${nftId}/image.png`
    };
    
    res.json({ success: true, nft });
  } catch (error) {
    console.error('Error fetching NFT data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET performance data for settlement
router.get('/performance/:leagueId', async (req, res) => {
  try {
    const { leagueId } = req.params;
    
    // Mock performance data for settlement
    const performanceData = {
      1: 85.5,
      2: 92.3,
      3: 78.1,
      4: 88.7,
      5: 95.2
    };
    
    res.json({
      success: true,
      leagueId: parseInt(leagueId),
      performanceData,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
