import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Lineups',
      description: 'Get intelligent lineup suggestions based on player performance, market value, and trending data.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Forte Actions',
      description: 'Automated settlement and payouts using Flow Forte Scheduled Transactions.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Staking',
      description: 'Stake FLOW tokens or NFTs with smart contract protection and escrow validation.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Cross-Ecosystem',
      description: 'Integrate NBA Top Shot moments and other Flow NFTs in your fantasy leagues.'
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20">
        <div className="flex justify-center mb-8">
          <Trophy className="w-24 h-24 text-flow-green animate-pulse" />
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-flow-green via-green-400 to-emerald-500 bg-clip-text text-transparent">
          Flow Fantasy Fusion
        </h1>
        
        <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
          AI-powered fantasy sports on Flow blockchain with automated settlements and cross-ecosystem NFT integration
        </p>
        
        <div className="flex justify-center space-x-6 pt-8">
          <Link to="/leagues" className="btn-primary text-lg">
            Browse Leagues
          </Link>
          <Link to="/leagues/create" className="btn-secondary text-lg">
            Create League
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-500">
          <p>Built on Flow | Forte Hacks Submission</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-flow-green">
          Key Features
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center space-y-4 hover:scale-105 transition-transform">
              <div className="flex justify-center text-flow-green">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-flow-green">
          How It Works
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-start space-x-6 card">
            <div className="bg-flow-green text-black font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Connect Wallet & Create/Join League</h3>
              <p className="text-gray-400">
                Connect your Flow wallet and browse available leagues or create your own with custom settings.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6 card">
            <div className="bg-flow-green text-black font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Stake Tokens & Build Lineup</h3>
              <p className="text-gray-400">
                Stake FLOW tokens or NFTs to enter. Use AI suggestions to optimize your lineup for maximum points.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6 card">
            <div className="bg-flow-green text-black font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Automated Settlement & Payouts</h3>
              <p className="text-gray-400">
                Forte Scheduled Transactions automatically settle the league at game end and distribute rewards to winners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-flow-gray rounded-2xl">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-flow-green mb-2">24/7</div>
            <div className="text-gray-400">Automated Operations</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-flow-green mb-2">100%</div>
            <div className="text-gray-400">On-Chain Transparency</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-flow-green mb-2">AI</div>
            <div className="text-gray-400">Powered Predictions</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
