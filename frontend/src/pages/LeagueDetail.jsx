import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Coins, Calendar, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { useFlow } from '../utils/FlowContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const LeagueDetail = () => {
  const { leagueId } = useParams();
  const { isAuthenticated, user } = useFlow();
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [aiLineup, setAiLineup] = useState(null);
  const [requestingAI, setRequestingAI] = useState(false);

  useEffect(() => {
    fetchLeagueDetails();
  }, [leagueId]);

  const fetchLeagueDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/leagues/${leagueId}`);
      setLeague(response.data.league);
    } catch (error) {
      console.error('Error fetching league:', error);
      // Mock data fallback
      setLeague({
        leagueId: parseInt(leagueId),
        name: 'NBA Fantasy Championship',
        description: 'Weekly NBA fantasy competition with Top Shot moments',
        status: 'Active',
        creator: '0x01',
        startTime: Date.now() + 86400000,
        endTime: Date.now() + 604800000,
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
          { address: '0x02', staked: 50.0, lineup: true }
        ],
        totalStaked: 75.5,
        settlementScheduled: false
      });
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
      const response = await axios.post(`${API_URL}/api/staking/stake`, {
        leagueId,
        playerAddress: user.addr,
        amount: stakeAmount,
        tokenType: 'FLOW'
      });

      if (response.data.success) {
        alert('Staked successfully! Transaction ID: ' + response.data.txId);
        fetchLeagueDetails();
      }
    } catch (error) {
      console.error('Error staking:', error);
      alert('Failed to stake tokens');
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
            <div className="text-2xl font-bold">{league.participants.length}/{league.config.maxPlayers}</div>
            <div className="text-sm text-gray-400">Players</div>
          </div>

          <div className="text-center p-4 bg-flow-dark rounded-lg">
            <Coins className="w-6 h-6 mx-auto mb-2 text-flow-green" />
            <div className="text-2xl font-bold">{league.totalStaked}</div>
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
                  min={league.config.entryFee}
                  max={league.config.maxStakePerUser}
                  step="0.1"
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Min: {league.config.entryFee} FLOW | Max: {league.config.maxStakePerUser} FLOW
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
                <span className="font-semibold">{league.config.entryFee} FLOW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Min Players</span>
                <span className="font-semibold">{league.config.minPlayers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Players</span>
                <span className="font-semibold">{league.config.maxPlayers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">NFT Staking</span>
                <span className="font-semibold">{league.config.allowNFTs ? 'Allowed' : 'Not Allowed'}</span>
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
              {league.participants.map((participant, index) => (
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
