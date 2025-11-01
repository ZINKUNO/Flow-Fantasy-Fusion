import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Github, FileText, Twitter, ExternalLink } from 'lucide-react';
import Header from './components/Header';
import Home from './pages/Home';
import Leagues from './pages/Leagues';
import CreateLeague from './pages/CreateLeague';
import LeagueDetail from './pages/LeagueDetail';
import Dashboard from './pages/Dashboard';
import { FlowProvider } from './utils/FlowContext';

function App() {
  return (
    <FlowProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
          <Header />
          <main className="container mx-auto px-4 py-8 min-h-[70vh]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/leagues" element={<Leagues />} />
              <Route path="/leagues/create" element={<CreateLeague />} />
              <Route path="/leagues/:leagueId" element={<LeagueDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          
          <footer className="bg-gradient-to-b from-transparent via-flow-dark to-black border-t border-gray-800 mt-20">
            <div className="container mx-auto px-4 py-12">
              {/* Main Footer Content */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Brand Section */}
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold mb-3">
                    <span className="gradient-text">Flow Fantasy Fusion</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    AI-powered fantasy sports on Flow blockchain with automated settlements
                  </p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-flow-green/10 text-flow-green border border-flow-green/30">
                      Built on Flow
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      Forte Hacks
                    </span>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">Quick Links</h4>
                  <div className="space-y-2">
                    <Link to="/leagues" className="block text-gray-400 hover:text-flow-green transition-colors">
                      Browse Leagues
                    </Link>
                    <Link to="/leagues/create" className="block text-gray-400 hover:text-flow-green transition-colors">
                      Create League
                    </Link>
                    <Link to="/dashboard" className="block text-gray-400 hover:text-flow-green transition-colors">
                      Dashboard
                    </Link>
                  </div>
                </div>

                {/* Resources */}
                <div className="text-center md:text-right">
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">Resources</h4>
                  <div className="space-y-2">
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center md:justify-end gap-2 text-gray-400 hover:text-flow-green transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a 
                      href="#" 
                      className="flex items-center justify-center md:justify-end gap-2 text-gray-400 hover:text-flow-green transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Documentation</span>
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center md:justify-end gap-2 text-gray-400 hover:text-flow-green transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      <span>Twitter</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-gray-800 pt-6 text-center">
                <p className="text-sm text-gray-400 mb-2">
                  <span className="text-flow-green font-semibold">Flow Fantasy Fusion</span> © 2025 | Powered by AI & Forte Actions
                </p>
                <p className="text-xs text-gray-500">
                  Built for Forte Hacks on Flow Blockchain
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </FlowProvider>
  );
}

export default App;
