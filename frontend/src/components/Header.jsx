import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Wallet, LogOut, User } from 'lucide-react';
import { useFlow } from '../utils/FlowContext';

const Header = () => {
  const { user, isAuthenticated, logIn, logOut, isLoading } = useFlow();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-flow-dark border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Trophy className="text-flow-green w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold">
              <span className="gradient-text">Flow Fantasy Fusion</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/leagues" 
              className={`nav-link ${isActive('/leagues') && !isActive('/leagues/create') ? 'nav-link-active' : ''}`}
            >
              Leagues
            </Link>
            <Link 
              to="/leagues/create" 
              className={`nav-link ${isActive('/leagues/create') ? 'nav-link-active' : ''}`}
            >
              Create League
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 bg-flow-gray px-4 py-2 rounded-lg border border-gray-700 hover:border-flow-green transition-all duration-300">
                  <User className="w-4 h-4 text-flow-green" />
                  <span className="text-sm text-gray-300 font-mono">
                    {user.addr.substring(0, 6)}...{user.addr.substring(user.addr.length - 4)}
                  </span>
                </div>
                <button
                  onClick={logOut}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 disabled:opacity-50 hover:scale-105"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Disconnect</span>
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
