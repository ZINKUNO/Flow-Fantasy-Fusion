import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Coins, Clock } from 'lucide-react';
import { useFlow } from '../utils/FlowContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Dashboard = () => {
  const { user, isAuthenticated } = useFlow();
  const [myLeagues, setMyLeagues] = useState([]);
  const [stats, setStats] = useState({
    totalStaked: 0,
    activeLeagues: 0,
    wonLeagues: 0,
    totalWinnings: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      // Fetch all leagues from blockchain
      const response = await axios.get(`${API_URL}/api/leagues`);
      const allLeagues = response.data.data || [];
      
      // Filter leagues where user is a participant
      const userLeagues = allLeagues.filter(league => {
        // Check if user's address is in participants (when we add participant tracking)
        // For now, fetch user's stake info for each league
        return true; // Will be filtered by stake info below
      });
      
      // Fetch stake info for each league
      const leaguesWithStakes = await Promise.all(
        userLeagues.map(async (league) => {
          try {
            const stakeResponse = await axios.get(
              `${API_URL}/api/staking/${league.id}/${user.addr}`
            );
            const stakeInfo = stakeResponse.data.stakeInfo;
            
            if (stakeInfo && stakeInfo.totalStaked > 0) {
              return {
                leagueId: league.id,
                name: league.name,
                status: league.status,
                staked: stakeInfo.totalStaked,
                position: 0, // Will be calculated from leaderboard
                totalPlayers: league.participantCount || 0,
                endTime: league.endTime,
                winnings: 0 // Will be set if league is completed and user won
              };
            }
            return null;
          } catch (err) {
            return null;
          }
        })
      );
      
      // Filter out null values (leagues user hasn't joined)
      const myLeaguesData = leaguesWithStakes.filter(l => l !== null);
      setMyLeagues(myLeaguesData);
      
      // Calculate stats
      const totalStaked = myLeaguesData.reduce((sum, l) => sum + l.staked, 0);
      const activeLeagues = myLeaguesData.filter(l => 
        l.status === 'Active' || l.status === 'InProgress'
      ).length;
      const wonLeagues = myLeaguesData.filter(l => l.winnings > 0).length;
      const totalWinnings = myLeaguesData.reduce((sum, l) => sum + (l.winnings || 0), 0);
      
      setStats({
        totalStaked: totalStaked.toFixed(2),
        activeLeagues,
        wonLeagues,
        totalWinnings: totalWinnings.toFixed(2)
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set empty state on error
      setMyLeagues([]);
      setStats({
        totalStaked: 0,
        activeLeagues: 0,
        wonLeagues: 0,
        totalWinnings: 0
      });
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

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-400 mb-6">
          Please connect your wallet to view your dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-flow-green mb-2">My Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user.addr.substring(0, 10)}...</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card text-center">
          <Coins className="w-8 h-8 mx-auto mb-3 text-flow-green" />
          <div className="text-3xl font-bold mb-1">{stats.totalStaked}</div>
          <div className="text-sm text-gray-400">Total Staked (FLOW)</div>
        </div>

        <div className="card text-center">
          <Clock className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
          <div className="text-3xl font-bold mb-1">{stats.activeLeagues}</div>
          <div className="text-sm text-gray-400">Active Leagues</div>
        </div>

        <div className="card text-center">
          <Trophy className="w-8 h-8 mx-auto mb-3 text-flow-green" />
          <div className="text-3xl font-bold mb-1">{stats.wonLeagues}</div>
          <div className="text-sm text-gray-400">Leagues Won</div>
        </div>

        <div className="card text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-500" />
          <div className="text-3xl font-bold mb-1">{stats.totalWinnings}</div>
          <div className="text-sm text-gray-400">Total Winnings (FLOW)</div>
        </div>
      </div>

      {/* My Leagues */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">My Leagues</h2>

        {myLeagues.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="mb-4">You haven't joined any leagues yet</p>
            <Link to="/leagues" className="btn-primary inline-block">
              Browse Leagues
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myLeagues.map((league) => (
              <div key={league.leagueId} className="bg-flow-dark p-6 rounded-lg flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-bold">{league.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      league.status === 'Active' ? 'bg-green-600' :
                      league.status === 'Completed' ? 'bg-blue-600' :
                      'bg-gray-600'
                    }`}>
                      {league.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <span>Staked: {league.staked} FLOW</span>
                    <span>Position: #{league.position}/{league.totalPlayers}</span>
                    {league.endTime && (
                      <span>Ends: {formatDate(league.endTime)}</span>
                    )}
                  </div>

                  {league.winnings && (
                    <div className="text-sm font-bold text-flow-green">
                      Won: {league.winnings} FLOW 🎉
                    </div>
                  )}
                </div>

                <Link
                  to={`/leagues/${league.leagueId}`}
                  className="btn-secondary"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-flow-dark rounded-lg">
            <div>
              <p className="font-semibold">Staked 25.5 FLOW</p>
              <p className="text-sm text-gray-400">NBA Fantasy Championship</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-flow-dark rounded-lg">
            <div>
              <p className="font-semibold">Won 450 FLOW</p>
              <p className="text-sm text-gray-400">NFL Weekly Challenge</p>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-flow-dark rounded-lg">
            <div>
              <p className="font-semibold">Requested AI Lineup</p>
              <p className="text-sm text-gray-400">NBA Fantasy Championship</p>
            </div>
            <span className="text-xs text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
