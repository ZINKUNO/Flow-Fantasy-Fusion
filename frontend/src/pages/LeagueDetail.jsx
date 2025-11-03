import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Coins, Calendar, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { useFlow } from '../utils/FlowContext';
import * as fcl from '@onflow/fcl';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const LeagueDetail = () => {
  const { leagueId: leagueIdParam } = useParams();
  // Parse leagueId as number, handle both numeric and string IDs
  const leagueId = parseInt(leagueIdParam) || leagueIdParam;
  const { isAuthenticated, user } = useFlow();
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [aiLineup, setAiLineup] = useState(null);
  const [requestingAI, setRequestingAI] = useState(false);

  useEffect(() => {
    fetchLeagueDetails();
  }, [leagueId]);

  const fetchLeagueDetails = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Add cache busting parameter if force refresh
      const cacheBuster = forceRefresh ? `?t=${Date.now()}` : '';
      const response = await axios.get(`${API_URL}/api/leagues/${leagueId}${cacheBuster}`);
      const leagueData = response.data.league || response.data;
      
      // Fetch real stake info if user is authenticated
      let userStakeInfo = null;
      if (isAuthenticated && user) {
        try {
          const stakeResponse = await axios.get(
            `${API_URL}/api/staking/${leagueId}/${user.addr}${cacheBuster}`
          );
          userStakeInfo = stakeResponse.data.stakeInfo;
        } catch (err) {
          console.log('No stake info for user');
        }
      }
      
      // Enrich league data with real stake info
      const enrichedLeague = {
        ...leagueData,
        userStaked: userStakeInfo?.totalStaked || 0,
        userHasJoined: userStakeInfo?.totalStaked > 0
      };
      
      setLeague(enrichedLeague);
    } catch (error) {
      console.error('Error fetching league:', error);
      setLeague(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Get transaction from backend
      const response = await axios.post(`${API_URL}/api/staking/stake`, {
        leagueId,
        playerAddress: user.addr,
        amount: stakeAmount,
        tokenType: 'FLOW'
      });

      if (response.data.success && response.data.transaction) {
        console.log('Executing stake transaction...');
        
        // Execute transaction on blockchain with user's wallet
        const txId = await fcl.mutate({
          cadence: response.data.transaction,
          args: (arg, t) => [
            arg(leagueId, t.UInt64),
            arg(stakeAmount.toFixed(8), t.UFix64)
          ],
          proposer: fcl.authz,
          payer: fcl.authz,
          authorizations: [fcl.authz],
          limit: 9999
        });

        console.log('Transaction submitted:', txId);
        alert(`Staked successfully! Transaction ID: ${txId}\n\nView on Flowscan: https://testnet.flowscan.org/transaction/${txId}`);
        
        // Wait for transaction to be sealed
        await fcl.tx(txId).onceSealed();
        console.log('Transaction sealed');
        
        // Clear backend cache to get fresh data
        try {
          await axios.delete(`${API_URL}/api/leagues/cache`);
        } catch (err) {
          console.log('Cache clear failed, will fetch anyway');
        }
        
        // Wait a moment for blockchain to update
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fetch fresh league data
        await fetchLeagueDetails();
      }
    } catch (error) {
      console.error('Error staking:', error);
      
      // Check for specific error messages
      const errorMsg = error.message || error.toString();
      
      if (errorMsg.includes('Player already joined')) {
        alert('✅ You have already joined this league!\n\nYour address is already in the participants list.');
      } else if (errorMsg.includes('League not found')) {
        alert('❌ League not found. Please try a different league.');
      } else if (errorMsg.includes('declined') || errorMsg.includes('rejected')) {
        alert('Transaction was cancelled.');
      } else {
        alert('Failed to join league: ' + errorMsg.substring(0, 200));
      }
    }
  };

  const requestAILineup = async () => {
    setRequestingAI(true);
    try {
      const response = await axios.post(`${API_URL}/api/ai/predict-lineup`, {
        leagueId,
        playerAddress: user?.addr || '0x01',
        availablePlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        positions: ['PG', 'SG', 'SF', 'PF', 'C'],
        optimizationGoal: 'balanced'
      });

      if (response.data.success) {
        setAiLineup(response.data.lineup);
      }
    } catch (error) {
      console.error('Error requesting AI lineup:', error);
      alert('Failed to get AI lineup suggestion');
    } finally {
      setRequestingAI(false);
    }
  };

  const scheduleSettlement = async () => {
    if (!league) return;

    try {
      const response = await axios.post(`${API_URL}/api/staking/schedule-settlement`, {
        leagueId,
        scheduledTime: Math.floor(league.endTime / 1000)
      });

      if (response.data.success) {
        alert('Settlement scheduled! Transaction ID: ' + response.data.txId);
        fetchLeagueDetails();
      }
    } catch (error) {
      console.error('Error scheduling settlement:', error);
      alert('Failed to schedule settlement');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flow-green"></div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-400">League not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{league.name}</h1>
            <p className="text-gray-400">{league.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            league.status === 'Active' ? 'bg-green-600' :
            league.status === 'Pending' ? 'bg-yellow-600' :
            'bg-gray-600'
          }`}>
            {league.status}
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-flow-dark rounded-lg">
            <Users className="w-6 h-6 mx-auto mb-2 text-flow-green" />
            <div className="text-2xl font-bold">{league.participantCount || 0}/{league.maxPlayers || 20}</div>
            <div className="text-sm text-gray-400">Players</div>
          </div>

          <div className="text-center p-4 bg-flow-dark rounded-lg">
            <Coins className="w-6 h-6 mx-auto mb-2 text-flow-green" />
            <div className="text-2xl font-bold">{league.prizePool || 0}</div>
            <div className="text-sm text-gray-400">Total Staked</div>
          </div>

          <div className="text-center p-4 bg-flow-dark rounded-lg">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-flow-green" />
            <div className="text-sm font-bold">{formatDate(league.startTime)}</div>
            <div className="text-sm text-gray-400">Starts</div>
          </div>

          <div className="text-center p-4 bg-flow-dark rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-2 text-flow-green" />
            <div className="text-sm font-bold">{formatDate(league.endTime)}</div>
            <div className="text-sm text-gray-400">Ends</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Staking Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Coins className="w-6 h-6 text-flow-green" />
              <span>Join & Stake</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Stake Amount (FLOW)
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(parseFloat(e.target.value))}
                  min={league.entryFee || 10}
                  max={league.maxStakePerUser || 1000}
                  step="0.1"
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Min: {league.entryFee || 10} FLOW | Max: {league.maxStakePerUser || 1000} FLOW
                </p>
              </div>

              <button
                onClick={handleStake}
                disabled={!isAuthenticated}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isAuthenticated ? 'Stake & Join League' : 'Connect Wallet to Join'}
              </button>
            </div>
          </div>

          {/* AI Lineup Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-flow-green" />
              <span>AI Lineup Suggestion</span>
            </h2>

            {!aiLineup ? (
              <button
                onClick={requestAILineup}
                disabled={requestingAI || !isAuthenticated}
                className="w-full btn-secondary disabled:opacity-50"
              >
                {requestingAI ? 'Requesting AI Lineup...' : 'Get AI Lineup Suggestion'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-flow-dark p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Suggested Lineup</span>
                    <span className="text-flow-green">
                      Score: {aiLineup.expectedScore.toFixed(1)}
                    </span>
                  </div>

                  {Object.entries(aiLineup.positions).map(([position, players]) => (
                    <div key={position} className="flex justify-between py-2 border-b border-gray-700">
                      <span className="font-semibold">{position}</span>
                      <span className="text-gray-400">Player #{players[0]}</span>
                    </div>
                  ))}

                  <p className="text-sm text-gray-400 mt-4">
                    <strong>AI Rationale:</strong> {aiLineup.rationale}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Confidence: {(aiLineup.confidence * 100).toFixed(0)}%
                  </p>
                </div>

                <button
                  onClick={requestAILineup}
                  className="w-full btn-secondary"
                >
                  Regenerate Lineup
                </button>
              </div>
            )}
          </div>

          {/* Settlement Section */}
          {league.status === 'InProgress' && !league.settlementScheduled && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-flow-green" />
                <span>Schedule Settlement</span>
              </h2>

              <p className="text-gray-400 mb-4">
                Use Forte Scheduled Transactions to automatically settle this league at the end time.
              </p>

              <button
                onClick={scheduleSettlement}
                className="w-full btn-primary"
              >
                Schedule Automatic Settlement
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* League Config */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">League Configuration</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Fee</span>
                <span className="font-semibold">{league.entryFee || 10} FLOW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Min Players</span>
                <span className="font-semibold">{league.minPlayers || 2}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Players</span>
                <span className="font-semibold">{league.maxPlayers || 20}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">NFT Staking</span>
                <span className="font-semibold">{league.allowNFTs ? 'Allowed' : 'Not Allowed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Settlement</span>
                <span className="font-semibold">{league.settlementScheduled ? '✅ Scheduled' : '⏳ Pending'}</span>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Participants</h3>
            <div className="space-y-3">
              {(league.participants || []).map((participant, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-flow-dark rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-flow-green rounded-full flex items-center justify-center text-black font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-mono">
                      {participant.address.substring(0, 6)}...
                      {participant.address.substring(participant.address.length - 4)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-flow-green">{participant.staked} FLOW</div>
                    {participant.lineup && (
                      <div className="text-xs text-gray-400">✓ Lineup Set</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueDetail;
