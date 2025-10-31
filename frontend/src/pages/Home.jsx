import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Sparkles, Zap, Shield, TrendingUp, Rocket, Brain, DollarSign, Image, Github, FileText } from 'lucide-react';

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

  const valueProps = [
    { icon: <Rocket className="w-6 h-6" />, label: 'Easy Setup' },
    { icon: <Brain className="w-6 h-6" />, label: 'AI Insights' },
    { icon: <DollarSign className="w-6 h-6" />, label: 'Auto-Settlements' },
    { icon: <Image className="w-6 h-6" />, label: 'NFT Integration' }
  ];

  return (
    <div className="space-y-20 relative">
      {/* Animated Background */}
      <div className="animated-bg"></div>

      {/* Hero Section */}
      <section className="text-center space-y-8 py-20 relative">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Trophy 
              className="w-24 h-24 text-flow-green transition-transform hover:scale-110 hover:rotate-12 duration-500" 
              style={{ 
                animation: 'float 3s ease-in-out infinite',
                filter: 'drop-shadow(0 0 20px rgba(0, 255, 135, 0.5))'
              }}
            />
            <div className="absolute inset-0 w-24 h-24 animate-ping opacity-20">
              <Trophy className="w-24 h-24 text-flow-green" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <span className="gradient-text glow-effect">
            AI-Powered Fantasy Sports
          </span>
          <br />
          <span className="text-3xl md:text-5xl bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
            on Flow Blockchain
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Build. Compete. Earn. — <span className="text-flow-green font-semibold">Smarter</span>, <span className="text-flow-green font-semibold">Faster</span>, <span className="text-flow-green font-semibold">Fairer</span>
        </p>

        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Create or join fantasy leagues that settle <span className="text-flow-green font-semibold">automatically on-chain</span>, with rewards powered by <span className="text-flow-green font-semibold">AI</span> and <span className="text-flow-green font-semibold">Flow NFTs</span>.
        </p>

        {/* Value Props Badges */}
        <div className="flex flex-wrap justify-center gap-4 pt-6 pb-4">
          {valueProps.map((prop, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 bg-flow-gray border border-gray-700 px-4 py-2 rounded-full hover:border-flow-green transition-all duration-300 hover:scale-105"
            >
              <div className="text-flow-green">{prop.icon}</div>
              <span className="text-sm font-semibold">{prop.label}</span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-8">
          <Link to="/leagues" className="btn-primary text-lg group">
            <span className="flex items-center justify-center space-x-2">
              <span>Browse Leagues</span>
              <Zap className="w-5 h-5 group-hover:animate-bounce" />
            </span>
          </Link>
          <Link to="/leagues/create" className="btn-secondary text-lg group">
            <span className="flex items-center justify-center space-x-2">
              <span>Create League</span>
              <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </span>
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-500 space-y-2">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-flow-green/10 text-flow-green border border-flow-green/30">
              Built on Flow
            </span>
            <span className="text-gray-600">|</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Forte Hacks Submission
            </span>
          </p>
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
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="gradient-text">How It Works</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg">Get started in 3 simple steps</p>
        
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 card group hover:bg-opacity-80">
            <div className="bg-gradient-to-br from-flow-green to-green-400 text-black font-bold rounded-2xl w-16 h-16 flex items-center justify-center flex-shrink-0 text-2xl shadow-lg group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Rocket className="w-6 h-6 text-flow-green" />
                Create or Join League
              </h3>
              <p className="text-gray-400 text-lg">
                Connect your Flow wallet and browse available leagues or create your own with custom settings, entry fees, and prize pools.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 card group hover:bg-opacity-80">
            <div className="bg-gradient-to-br from-flow-green to-green-400 text-black font-bold rounded-2xl w-16 h-16 flex items-center justify-center flex-shrink-0 text-2xl shadow-lg group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Brain className="w-6 h-6 text-flow-green" />
                Stake & Get AI Lineup
              </h3>
              <p className="text-gray-400 text-lg">
                Stake FLOW tokens or NFTs to enter. Use our AI-powered lineup optimizer to build the perfect team based on real-time data.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 card group hover:bg-opacity-80">
            <div className="bg-gradient-to-br from-flow-green to-green-400 text-black font-bold rounded-2xl w-16 h-16 flex items-center justify-center flex-shrink-0 text-2xl shadow-lg group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6 text-flow-green" />
                Auto-Settle & Earn Rewards
              </h3>
              <p className="text-gray-400 text-lg">
                Forte Scheduled Transactions automatically settle results and distribute rewards to winners. No manual intervention needed!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-flow-gray via-gray-800 to-flow-gray rounded-2xl border border-gray-700 hover:border-flow-green transition-all duration-500">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="group">
            <div className="text-5xl md:text-6xl font-bold mb-2">
              <span className="gradient-text">24/7</span>
            </div>
            <div className="text-gray-400 text-lg">Automated Operations</div>
          </div>
          <div className="group">
            <div className="text-5xl md:text-6xl font-bold mb-2">
              <span className="gradient-text">100%</span>
            </div>
            <div className="text-gray-400 text-lg">On-Chain Transparency</div>
          </div>
          <div className="group">
            <div className="text-5xl md:text-6xl font-bold mb-2">
              <span className="gradient-text">AI</span>
            </div>
            <div className="text-gray-400 text-lg">Powered Predictions</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto card bg-gradient-to-br from-flow-gray via-gray-800 to-flow-gray border-2 border-flow-green p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text glow-effect">Ready to Play?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the future of fantasy sports. Start competing with AI-powered insights and blockchain-verified fairness.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link to="/leagues" className="btn-primary text-lg">
              <span className="flex items-center justify-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Browse Active Leagues</span>
              </span>
            </Link>
            <Link to="/leagues/create" className="btn-secondary text-lg">
              <span className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Create Your League</span>
              </span>
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-700 mt-6">
            <p className="text-sm text-gray-400 mb-4">Built for Forte Hacks | Powered by Flow Blockchain</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-flow-green transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <span className="text-gray-600">|</span>
              <a 
                href="#" 
                className="flex items-center space-x-2 text-gray-400 hover:text-flow-green transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Documentation</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
