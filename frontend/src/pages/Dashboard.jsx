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
      // In production: fetch actual user data from blockchain
      // Mock data for hackathon
      setMyLeagues([
        {
          leagueId: 1,
          name: 'NBA Fantasy Championship',
          status: 'Active',
          staked: 25.5,
          position: 2,
          totalPlayers: 12,
          endTime: Date.now() + 604800000
        },
        {
          leagueId: 2,
          name: 'NFL Weekly Challenge',
          status: 'Completed',
          staked: 50.0,
          position: 1,
          totalPlayers: 16,
          winnings: 450.0
        }
      ]);

      setStats({
        totalStaked: 75.5,
        activeLeagues: 1,
        wonLeagues: 1,
        totalWinnings: 450.0
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
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
