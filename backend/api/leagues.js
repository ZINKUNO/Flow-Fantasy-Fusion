const express = require('express');
const router = express.Router();
const fcl = require('@onflow/fcl');
const t = require('@onflow/types');

// Configure FCL
fcl.config({
  'accessNode.api': process.env.FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org',
  'discovery.wallet': process.env.FLOW_WALLET_DISCOVERY || 'https://fcl-discovery.onflow.org/testnet/authn',
  'app.detail.title': 'Flow Fantasy Fusion',
  'app.detail.icon': 'https://flow-fantasy-fusion.app/icon.png'
});

// GET all leagues
router.get('/', async (req, res) => {
  try {
    const cache = req.app.get('cache');
    const cacheKey = 'all_leagues';
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, leagues: cached, cached: true });
    }
    
    // In production, query Flow blockchain for leagues
    // For hackathon: return mock data structure
    const leagues = [
      {
        leagueId: 1,
        name: 'NBA Fantasy Challenge',
        description: 'Compete with NBA Top Shot moments',
        creator: '0x01',
        startTime: Date.now() + 86400000,
        endTime: Date.now() + 172800000,
        status: 'Pending',
        participants: 5,
        maxPlayers: 20,
        totalStaked: 150.5,
        tokenType: 'FLOW'
      }
    ];
    
    cache.set(cacheKey, leagues);
    
    res.json({ success: true, leagues, cached: false });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET league by ID
router.get('/:leagueId', async (req, res) => {
  try {
    const { leagueId } = req.params;
    const cache = req.app.get('cache');
    const cacheKey = `league_${leagueId}`;
    
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, league: cached, cached: true });
    }
    
    // Mock league data
    const league = {
      leagueId: parseInt(leagueId),
      name: 'NBA Fantasy Challenge',
      description: 'Compete with NBA Top Shot moments',
      creator: '0x01',
      startTime: Date.now() + 86400000,
      endTime: Date.now() + 172800000,
      status: 'Active',
      config: {
        minPlayers: 4,
        maxPlayers: 20,
        entryFee: 10.0,
        allowedTokens: ['FLOW', 'FUSD'],
        allowNFTs: true,
        maxStakePerUser: 1000.0
      },
      participants: [
        { address: '0x01', staked: 25.5, lineup: true },
        { address: '0x02', staked: 50.0, lineup: true },
        { address: '0x03', staked: 15.0, lineup: false }
      ],
      totalStaked: 90.5,
      settlementScheduled: true,
      scheduledTime: Date.now() + 172800000
    };
    
    cache.set(cacheKey, league);
    
    res.json({ success: true, league, cached: false });
  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create league
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      startTime,
      endTime,
      minPlayers,
      maxPlayers,
      entryFee,
      allowedTokens,
      allowNFTs
    } = req.body;
    
    // Validate input
    if (!name || !description || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // In production: Execute Cadence transaction to create league
    // For hackathon: return mock response
    const leagueId = Math.floor(Math.random() * 1000000);
    
    res.json({
      success: true,
      leagueId,
      txId: `0x${Math.random().toString(16).substr(2, 64)}`,
      message: 'League created successfully'
    });
  } catch (error) {
    console.error('Error creating league:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET league participants
router.get('/:leagueId/participants', async (req, res) => {
  try {
    const { leagueId } = req.params;
    
    // Mock participants
    const participants = [
      {
        address: '0x01cf0e2f2f715450',
        staked: 25.5,
        tokenType: 'FLOW',
        hasLineup: true,
        joinedAt: Date.now() - 3600000
      },
      {
        address: '0x179b6b1cb6755e31',
        staked: 50.0,
        tokenType: 'FLOW',
        hasLineup: true,
        joinedAt: Date.now() - 7200000
      }
    ];
    
    res.json({ success: true, leagueId: parseInt(leagueId), participants });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
