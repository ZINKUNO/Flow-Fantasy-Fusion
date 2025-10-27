import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Wallet, LogOut, User } from 'lucide-react';
import { useFlow } from '../utils/FlowContext';

const Header = () => {
  const { user, isAuthenticated, logIn, logOut, isLoading } = useFlow();

  return (
    <header className="bg-flow-dark border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="text-flow-green w-8 h-8" />
            <span className="text-2xl font-bold bg-gradient-to-r from-flow-green to-green-400 bg-clip-text text-transparent">
              Flow Fantasy Fusion
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/leagues" className="text-gray-300 hover:text-flow-green transition-colors">
              Leagues
            </Link>
            <Link to="/leagues/create" className="text-gray-300 hover:text-flow-green transition-colors">
              Create League
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-gray-300 hover:text-flow-green transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 bg-flow-gray px-4 py-2 rounded-lg">
                  <User className="w-4 h-4 text-flow-green" />
                  <span className="text-sm text-gray-300">
                    {user.addr.substring(0, 6)}...{user.addr.substring(user.addr.length - 4)}
                  </span>
                </div>
                <button
                  onClick={logOut}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              <button
                onClick={logIn}
                disabled={isLoading}
                className="flex items-center space-x-2 btn-primary disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
