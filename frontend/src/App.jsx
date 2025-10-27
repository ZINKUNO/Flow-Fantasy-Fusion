import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/leagues" element={<Leagues />} />
              <Route path="/leagues/create" element={<CreateLeague />} />
              <Route path="/leagues/:leagueId" element={<LeagueDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <footer className="bg-flow-dark border-t border-gray-800 mt-20">
            <div className="container mx-auto px-4 py-8 text-center text-gray-400">
              <p className="mb-2">
                <span className="text-flow-green font-bold">Flow Fantasy Fusion</span> - Built on Flow Blockchain
              </p>
              <p className="text-sm">
                Forte Hacks Submission | Powered by AI & Forte Actions
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </FlowProvider>
  );
}

export default App;
