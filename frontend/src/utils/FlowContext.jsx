import React, { createContext, useContext, useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

// Configure FCL
fcl.config({
  'accessNode.api': import.meta.env.VITE_FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org',
  'discovery.wallet': import.meta.env.VITE_FLOW_WALLET_DISCOVERY || 'https://fcl-discovery.onflow.org/testnet/authn',
  'app.detail.title': 'Flow Fantasy Fusion',
  'app.detail.icon': 'https://flow-fantasy-fusion.app/icon.png',
  '0xLeagueFactory': import.meta.env.VITE_CONTRACT_LEAGUE_FACTORY || '0xf8d6e0586b0a20c7',
  '0xStakingManager': import.meta.env.VITE_CONTRACT_STAKING_MANAGER || '0xf8d6e0586b0a20c7',
  '0xSettlement': import.meta.env.VITE_CONTRACT_SETTLEMENT || '0xf8d6e0586b0a20c7',
});

const FlowContext = createContext();

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within FlowProvider');
  }
  return context;
};

export const FlowProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to FCL user changes
    const unsubscribe = fcl.currentUser.subscribe((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const logIn = async () => {
    setIsLoading(true);
    try {
      await fcl.authenticate();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    setIsLoading(true);
    try {
      await fcl.unauthenticate();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeTransaction = async (cadence, args = []) => {
    setIsLoading(true);
    try {
      const txId = await fcl.mutate({
        cadence,
        args,
        limit: 1000,
      });

      console.log('Transaction submitted:', txId);
      
      const transaction = await fcl.tx(txId).onceSealed();
      console.log('Transaction sealed:', transaction);
      
      return transaction;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const executeScript = async (cadence, args = []) => {
    try {
      const result = await fcl.query({
        cadence,
        args,
      });
      return result;
    } catch (error) {
      console.error('Script error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    logIn,
    logOut,
    executeTransaction,
    executeScript,
    isAuthenticated: user && user.addr,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};
