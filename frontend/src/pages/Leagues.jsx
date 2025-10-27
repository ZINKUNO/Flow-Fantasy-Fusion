import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, Coins, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, pending, completed

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/leagues`);
      setLeagues(response.data.leagues || []);
    } catch (error) {
      console.error('Error fetching leagues:', error);
      // Mock data fallback
      setLeagues([
        {
          leagueId: 1,
          name: 'NBA Fantasy Championship',
          description: 'Weekly NBA fantasy competition with Top Shot moments',
          status: 'Active',
          participants: 12,
          maxPlayers: 20,
          totalStaked: 250.5,
          tokenType: 'FLOW',
          startTime: Date.now() + 86400000,
          endTime: Date.now() + 604800000
        },
        {
          leagueId: 2,
          name: 'NFL Weekly Challenge',
          description: 'High stakes NFL fantasy league',
          status: 'Pending',
          participants: 5,
          maxPlayers: 16,
          totalStaked: 120.0,
          tokenType: 'FLOW',
          startTime: Date.now() + 172800000,
          endTime: Date.now() + 777600000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeagues = leagues.filter(league => {
    if (filter === 'all') return true;
    return league.status.toLowerCase() === filter;
  });

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-flow-green">Fantasy Leagues</h1>
        <Link to="/leagues/create" className="btn-primary">
          Create New League
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-gray-700">
        {['all', 'active', 'pending', 'completed'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-6 py-3 font-semibold capitalize transition-colors ${
              filter === filterOption
                ? 'text-flow-green border-b-2 border-flow-green'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      {/* Leagues Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeagues.map((league) => (
          <Link
            key={league.leagueId}
            to={`/leagues/${league.leagueId}`}
            className="card hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{league.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  league.status === 'Active' ? 'bg-green-600' :
                  league.status === 'Pending' ? 'bg-yellow-600' :
                  'bg-gray-600'
                }`}>
                  {league.status}
                </span>
              </div>

              <p className="text-gray-400 text-sm line-clamp-2">
                {league.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{league.participants}/{league.maxPlayers} Players</span>
                  </div>
                  <div className="flex items-center space-x-2 text-flow-green">
                    <Coins className="w-4 h-4" />
                    <span>{league.totalStaked} {league.tokenType}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Starts: {formatDate(league.startTime)}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Ends: {formatDate(league.endTime)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-flow-green h-2 rounded-full transition-all"
                    style={{ width: `${(league.participants / league.maxPlayers) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredLeagues.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No leagues found for this filter.</p>
          <Link to="/leagues/create" className="btn-primary mt-6 inline-block">
            Create the First League
          </Link>
        </div>
      )}
    </div>
  );
};

export default Leagues;
