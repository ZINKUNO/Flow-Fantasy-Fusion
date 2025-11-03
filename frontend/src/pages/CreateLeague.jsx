import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, Shield } from 'lucide-react';
import { useFlow } from '../utils/FlowContext';
import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const CONTRACT_ADDRESS = '0xf474649aaa285cf5';

const CreateLeague = () => {
  const navigate = useNavigate();
  const { isAuthenticated, executeTransaction } = useFlow();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    minPlayers: 4,
    maxPlayers: 20,
    entryFee: 10,
    allowedTokens: ['FLOW', 'FUSD'],
    allowNFTs: true,
    maxStakePerUser: 1000
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    
    try {
      // Convert dates to timestamps
      const startTimestamp = new Date(formData.startTime).getTime() / 1000;
      const endTimestamp = new Date(formData.endTime).getTime() / 1000;

      // Create league transaction - uses public contract function
      const CREATE_LEAGUE_TX = `
import LeagueFactory from ${CONTRACT_ADDRESS}

transaction(
    name: String,
    description: String,
    startTime: UFix64,
    endTime: UFix64,
    minPlayers: UInt32,
    maxPlayers: UInt32,
    entryFee: UFix64,
    allowedTokens: [String],
    allowNFTs: Bool,
    maxStakePerUser: UFix64
) {
    let creatorAddress: Address

    prepare(signer: &Account) {
        // Capture the signer's address to use in execute
        self.creatorAddress = signer.address
    }

    execute {
        // Create league config
        let config = LeagueFactory.LeagueConfig(
            minPlayers: minPlayers,
            maxPlayers: maxPlayers,
            entryFee: entryFee,
            allowedTokens: allowedTokens,
            allowNFTs: allowNFTs,
            maxStakePerUser: maxStakePerUser
        )

        // Create the league using public contract function
        let leagueId = LeagueFactory.createLeaguePublic(
            name: name,
            description: description,
            creator: self.creatorAddress,
            startTime: startTime,
            endTime: endTime,
            config: config
        )

        log("League created with ID: ".concat(leagueId.toString()))
    }
}
      `;

      console.log('Submitting league creation transaction...');
      
      // Execute transaction
      const txId = await fcl.mutate({
        cadence: CREATE_LEAGUE_TX,
        args: (arg, t) => [
          arg(formData.name, t.String),
          arg(formData.description, t.String),
          arg(startTimestamp.toFixed(1), t.UFix64),
          arg(endTimestamp.toFixed(1), t.UFix64),
          arg(parseInt(formData.minPlayers), t.UInt32),
          arg(parseInt(formData.maxPlayers), t.UInt32),
          arg(parseFloat(formData.entryFee).toFixed(1), t.UFix64),
          arg(formData.allowedTokens, t.Array(t.String)),
          arg(formData.allowNFTs, t.Bool),
          arg(parseFloat(formData.maxStakePerUser).toFixed(1), t.UFix64)
        ],
        limit: 1000
      });

      console.log('Transaction ID:', txId);
      alert('Transaction submitted! Waiting for confirmation...');

      // Wait for transaction to be sealed
      const tx = await fcl.tx(txId).onceSealed();
      console.log('Transaction sealed:', tx);

      if (tx.status === 4) {
        alert('League created successfully!');
        navigate('/leagues');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error creating league:', error);
      alert(`Failed to create league: ${error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-flow-green">Create Fantasy League</h1>
        <p className="text-gray-400">
          Set up your custom fantasy sports league on Flow blockchain
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Shield className="w-6 h-6 text-flow-green" />
            <span>Basic Information</span>
          </h2>

          <div>
            <label className="block text-sm font-semibold mb-2">League Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="NBA Fantasy Championship"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Compete with your NBA Top Shot moments in this weekly challenge..."
              className="input-field"
            />
          </div>
        </div>

        {/* Timing */}
        <div className="space-y-4 pt-6 border-t border-gray-700">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-flow-green" />
            <span>Schedule</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Start Time *</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">End Time *</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="space-y-4 pt-6 border-t border-gray-700">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Users className="w-6 h-6 text-flow-green" />
            <span>Player Limits</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Minimum Players</label>
              <input
                type="number"
                name="minPlayers"
                value={formData.minPlayers}
                onChange={handleChange}
                min="2"
                max="100"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Maximum Players</label>
              <input
                type="number"
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={handleChange}
                min="2"
                max="100"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Staking */}
        <div className="space-y-4 pt-6 border-t border-gray-700">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-flow-green" />
            <span>Staking Configuration</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Entry Fee (FLOW)</label>
              <input
                type="number"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleChange}
                min="1"
                step="0.1"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Max Stake Per User (FLOW)</label>
              <input
                type="number"
                name="maxStakePerUser"
                value={formData.maxStakePerUser}
                onChange={handleChange}
                min="1"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="allowNFTs"
              checked={formData.allowNFTs}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-700 bg-flow-dark text-flow-green focus:ring-flow-green"
            />
            <label className="text-sm font-semibold">Allow NFT Staking</label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-700">
          <button
            type="submit"
            disabled={loading || !isAuthenticated}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating League...' : 'Create League'}
          </button>

          {!isAuthenticated && (
            <p className="text-center text-red-500 mt-4 text-sm">
              Please connect your wallet to create a league
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateLeague;
