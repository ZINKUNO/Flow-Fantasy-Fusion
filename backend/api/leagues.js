const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const flowService = require('../services/flowService');

// Cache for 2 minutes to reduce blockchain API calls
const cache = new NodeCache({ stdTTL: 120 });

// Simple in-memory rate limiter
const requestTracker = new Map();
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const MAX_REQUESTS = 5; // Max 5 requests per 10 seconds

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestTracker.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  requestTracker.set(ip, recentRequests);
  return true;
}

/**
 * GET /api/leagues
 * Fetch all active leagues from Flow blockchain
 */
router.get('/', async (req, res) => {
  try {
    // Check cache first (always return cached if available)
    const cachedLeagues = cache.get('all_leagues');
    if (cachedLeagues) {
      return res.json({
        success: true,
        data: cachedLeagues,
        cached: true,
        source: 'cache'
      });
    }

    // Check rate limit before making blockchain call
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment and try again.',
        retryAfter: 10
      });
    }

    // Fetch from blockchain
    console.log('Fetching leagues from Flow blockchain...');
    const leagues = await flowService.getLeagues();
    
    // Transform blockchain data to API format
    const formattedLeagues = leagues.map(league => ({
      id: league.id,
      name: league.name,
      description: league.description,
      startTime: parseFloat(league.startTime),
      endTime: parseFloat(league.endTime),
      minPlayers: parseInt(league.minPlayers),
      maxPlayers: parseInt(league.maxPlayers),
      entryFee: parseFloat(league.entryFee),
      allowedTokens: league.allowedTokens,
      allowNFTs: league.allowNFTs,
      maxStakePerUser: parseFloat(league.maxStakePerUser),
      status: league.status || 'active',
      participantCount: league.participants?.length || 0,
      prizePool: parseFloat(league.prizePool || 0),
      creator: league.creator
    }));
    
    // Cache the result
    cache.set('all_leagues', formattedLeagues);
    
    console.log(`Successfully fetched ${formattedLeagues.length} leagues from blockchain`);
    
    res.json({
      success: true,
      data: formattedLeagues,
      cached: false,
      source: 'blockchain',
      count: formattedLeagues.length
    });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leagues from blockchain',
      details: error.message
    });
  }
});

/**
 * GET /api/leagues/:leagueId
 * Get specific league details from blockchain
 */
router.get('/:leagueId', async (req, res) => {
  try {
    const { leagueId } = req.params;
    const cacheKey = `league_${leagueId}`;
    
    // Validate league ID
    if (!leagueId || isNaN(parseInt(leagueId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid league ID'
      });
    }
    
    // Check cache
    const cachedLeague = cache.get(cacheKey);
    if (cachedLeague) {
      return res.json({
        success: true,
        league: cachedLeague,
        cached: true,
        source: 'cache'
      });
    }

    // Fetch all leagues from blockchain
    console.log(`Fetching league ${leagueId} from Flow blockchain...`);
    const leagues = await flowService.getLeagues();
    
    // Find the specific league
    const league = leagues.find(l => String(l.id) === String(leagueId));
    
    if (!league) {
      return res.status(404).json({
        success: false,
        error: `League ${leagueId} not found on blockchain`
      });
    }
    
    // Format response
    const formattedLeague = {
      id: league.id,
      name: league.name,
      description: league.description,
      startTime: parseFloat(league.startTime),
      endTime: parseFloat(league.endTime),
      minPlayers: parseInt(league.minPlayers || 2),
      maxPlayers: parseInt(league.maxPlayers || 20),
      entryFee: parseFloat(league.entryFee || 0),
      allowedTokens: league.allowedTokens || ['FLOW'],
      allowNFTs: league.allowNFTs || false,
      maxStakePerUser: parseFloat(league.maxStakePerUser || 1000),
      status: league.status || 'Active',
      participantCount: league.participantCount || 0,
      prizePool: parseFloat(league.prizePool || 0),
      creator: league.creator
    };
    
    // Cache the result
    cache.set(cacheKey, formattedLeague);
    
    console.log(`Successfully fetched league ${leagueId} from blockchain`);
    
    res.json({
      success: true,
      league: formattedLeague,
      cached: false,
      source: 'blockchain'
    });
  } catch (error) {
    console.error(`Error fetching league ${req.params.leagueId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch league details from blockchain',
      details: error.message
    });
  }
});

/**
 * GET /api/leagues/:leagueId/participants
 * Get participants for a specific league
 */
router.get('/:leagueId/participants', async (req, res) => {
  try {
    const { leagueId } = req.params;
    
    if (!leagueId || isNaN(parseInt(leagueId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid league ID'
      });
    }

    console.log(`Fetching participants for league ${leagueId}...`);
    const participants = await flowService.getLeagueParticipants(parseInt(leagueId));
    
    res.json({
      success: true,
      data: participants,
      count: participants.length,
      source: 'blockchain'
    });
  } catch (error) {
    console.error(`Error fetching participants for league ${req.params.leagueId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch participants',
      details: error.message
    });
  }
});

/**
 * GET /api/leagues/:leagueId/status
 * Get real-time status of a league
 */
router.get('/:leagueId/status', async (req, res) => {
  try {
    const { leagueId } = req.params;
    
    if (!leagueId || isNaN(parseInt(leagueId))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid league ID'
      });
    }

    const [isActive, totalStake, settlementStatus] = await Promise.all([
      flowService.isLeagueActive(parseInt(leagueId)),
      flowService.getLeagueTotalStake(parseInt(leagueId)),
      flowService.getSettlementStatus(parseInt(leagueId))
    ]);
    
    res.json({
      success: true,
      data: {
        leagueId: parseInt(leagueId),
        isActive,
        totalStake: parseFloat(totalStake),
        settlementStatus,
        timestamp: Date.now()
      },
      source: 'blockchain'
    });
  } catch (error) {
    console.error(`Error fetching status for league ${req.params.leagueId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch league status',
      details: error.message
    });
  }
});

/**
 * DELETE /api/leagues/cache
 * Clear the leagues cache (useful after transactions)
 */
router.delete('/cache', (req, res) => {
  try {
    cache.flushAll();
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
});

/**
 * POST /api/leagues
 * Create a new league
 */
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
    
    // Create league on blockchain
    const leagueId = await flowService.createLeague({
      name,
      description,
      startTime,
      endTime,
      minPlayers,
      maxPlayers,
      entryFee,
      allowedTokens,
      allowNFTs
    });
    
    res.json({
      success: true,
      leagueId,
      message: 'League created successfully'
    });
  } catch (error) {
    console.error('Error creating league:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
