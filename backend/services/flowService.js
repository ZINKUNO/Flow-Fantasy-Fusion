const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
require('dotenv').config();

// Configure FCL
fcl.config({
  "accessNode.api": process.env.FLOW_ACCESS_NODE || "https://rest-testnet.onflow.org",
  "flow.network": process.env.FLOW_NETWORK || "testnet",
  "app.detail.title": "Flow Fantasy Fusion",
  "app.detail.icon": "https://placekitten.com/g/200/200"
});

class FlowService {
  constructor() {
    this.leagueFactoryAddress = process.env.CONTRACT_LEAGUE_FACTORY;
    this.stakingManagerAddress = process.env.CONTRACT_STAKING_MANAGER;
    this.settlementAddress = process.env.CONTRACT_SETTLEMENT;
  }

  /**
   * Get all active leagues from blockchain
   */
  async getLeagues() {
    try {
      const script = `
        import LeagueFactory from ${this.leagueFactoryAddress}
        
        access(all) fun main(): [AnyStruct] {
          let leagues: [AnyStruct] = []
          let leagueIds = LeagueFactory.getLeagueIds()
          
          for leagueId in leagueIds {
            if let league = LeagueFactory.getLeagueDetails(leagueId: leagueId) {
              leagues.append(league)
            }
          }
          
          return leagues
        }
      `;
      
      const result = await fcl.query({ cadence: script });
      return result || [];
    } catch (error) {
      console.error('Error fetching leagues from blockchain:', error);
      throw new Error(`Failed to fetch leagues: ${error.message}`);
    }
  }

  /**
   * Get specific league details
   */
  async getLeagueDetails(leagueId) {
    try {
      const script = `
        import LeagueFactory from ${this.leagueFactoryAddress}
        
        access(all) fun main(leagueId: UInt64): AnyStruct? {
          return LeagueFactory.getLeagueDetails(leagueId: leagueId)
        }
      `;
      
      const result = await fcl.query({ 
        cadence: script,
        args: (arg, t) => [arg(parseInt(leagueId), t.UInt64)]
      });
      
      return result;
    } catch (error) {
      console.error(`Error fetching league ${leagueId}:`, error);
      throw new Error(`Failed to fetch league details: ${error.message}`);
    }
  }

  /**
   * Get user's stakes across all leagues
   */
  async getUserStakes(address) {
    try {
      const script = `
        import StakingManager from ${this.stakingManagerAddress}
        
        access(all) fun main(address: Address): [AnyStruct] {
          return StakingManager.getUserStakes(address: address)
        }
      `;
      
      const result = await fcl.query({ 
        cadence: script,
        args: (arg, t) => [arg(address, t.Address)]
      });
      
      return result || [];
    } catch (error) {
      console.error(`Error fetching stakes for ${address}:`, error);
      throw new Error(`Failed to fetch user stakes: ${error.message}`);
    }
  }

  /**
   * Get league participants
   */
  async getLeagueParticipants(leagueId) {
    try {
      const script = `
        import LeagueFactory from ${this.leagueFactoryAddress}
        
        access(all) fun main(leagueId: UInt64): [Address] {
          return LeagueFactory.getLeagueParticipants(leagueId: leagueId)
        }
      `;
      
      const result = await fcl.query({ 
        cadence: script,
        args: (arg, t) => [arg(parseInt(leagueId), t.UInt64)]
      });
      
      return result || [];
    } catch (error) {
      console.error(`Error fetching participants for league ${leagueId}:`, error);
      throw new Error(`Failed to fetch participants: ${error.message}`);
    }
  }

  /**
   * Get total staked amount for a league
   */
  async getLeagueTotalStake(leagueId) {
    try {
      const script = `
        import StakingManager from ${this.stakingManagerAddress}
        
        access(all) fun main(leagueId: UInt64): UFix64 {
          return StakingManager.getLeagueTotalStake(leagueId: leagueId)
        }
      `;
      
      const result = await fcl.query({ 
        cadence: script,
        args: (arg, t) => [arg(parseInt(leagueId), t.UInt64)]
      });
      
      return result || 0;
    } catch (error) {
      console.error(`Error fetching total stake for league ${leagueId}:`, error);
      return 0;
    }
  }

  /**
   * Check if user has staked in a league
   */
  async hasUserStaked(leagueId, address) {
    try {
      const script = `
        import StakingManager from ${this.stakingManagerAddress}
        
        access(all) fun main(leagueId: UInt64, address: Address): Bool {
          return StakingManager.hasStake(leagueId: leagueId, address: address)
        }
      `;
      
      const result = await fcl.query({ 
        cadence: script,
        args: (arg, t) => [
          arg(parseInt(leagueId), t.UInt64),
          arg(address, t.Address)
        ]
      });
      
      return result || false;
    } catch (error) {
      console.error(`Error checking stake for ${address} in league ${leagueId}:`, error);
      return false;
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(address) {
    try {
      const script = `
        import FlowToken from 0x7e60df042a9c0868
        import FungibleToken from 0x9a0766d93b6608b7
        
        access(all) fun main(address: Address): UFix64 {
          let account = getAccount(address)
          let vaultRef = account
            .getCapability(/public/flowTokenBalance)
            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
          
          return vaultRef?.balance ?? 0.0
        }
      `;
      
      const result = await fcl.query({ 
        cadence: script,
        args: (arg, t) => [arg(address, t.Address)]
      });
      
      return parseFloat(result || 0);
    } catch (error) {
      console.error(`Error fetching balance for ${address}:`, error);
      return 0;
    }
  }

  /**
   * Check if league is active
   */
  async isLeagueActive(leagueId) {
    try {
      const league = await this.getLeagueDetails(leagueId);
      if (!league) return false;
      
      const now = Date.now() / 1000;
      return now >= league.startTime && now <= league.endTime;
    } catch (error) {
      console.error(`Error checking if league ${leagueId} is active:`, error);
      return false;
    }
  }

  /**
   * Get settlement status for a league
   */
  async getSettlementStatus(leagueId) {
    try {
      const script = `
        import Settlement from ${this.settlementAddress}
        
        access(all) fun main(leagueId: UInt64): String {
          return Settlement.getSettlementStatus(leagueId: leagueId)
        }
      `;
      
      const result = await fcl.query({ 
        cadence: script,
        args: (arg, t) => [arg(parseInt(leagueId), t.UInt64)]
      });
      
      return result || "pending";
    } catch (error) {
      console.error(`Error fetching settlement status for league ${leagueId}:`, error);
      return "unknown";
    }
  }

  /**
   * Create a new league on the blockchain
   */
  async createLeague(leagueData) {
    try {
      const {
        name,
        description,
        startTime,
        endTime,
        minPlayers,
        maxPlayers,
        entryFee,
        allowedTokens,
        allowNFTs,
        maxStakePerUser
      } = leagueData;

      // For now, return a mock league ID since we need wallet authorization
      // In production, this would be called from the frontend with FCL
      const mockLeagueId = Math.floor(Math.random() * 1000) + 1;
      
      console.log('League creation requested:', {
        name,
        description,
        startTime,
        endTime,
        minPlayers,
        maxPlayers,
        entryFee,
        allowedTokens,
        allowNFTs,
        maxStakePerUser
      });
      
      // Return mock ID - frontend should handle actual transaction
      return mockLeagueId;
    } catch (error) {
      console.error('Error creating league:', error);
      throw new Error(`Failed to create league: ${error.message}`);
    }
  }
}

module.exports = new FlowService();
