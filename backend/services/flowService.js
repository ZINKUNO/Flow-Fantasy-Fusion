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
        
        access(all) struct LeagueWithId {
          access(all) let id: UInt64
          access(all) let name: String
          access(all) let description: String
          access(all) let creator: Address
          access(all) let startTime: UFix64
          access(all) let endTime: UFix64
          access(all) let status: UInt8
          access(all) let participantCount: Int
          access(all) let minPlayers: UInt32
          access(all) let maxPlayers: UInt32
          access(all) let entryFee: UFix64
          access(all) let maxStakePerUser: UFix64
          access(all) let allowNFTs: Bool
          
          init(id: UInt64, league: &LeagueFactory.League) {
            self.id = id
            self.name = league.name
            self.description = league.description
            self.creator = league.creator
            self.startTime = league.startTime
            self.endTime = league.endTime
            self.status = league.status.rawValue
            self.participantCount = league.participants.length
            self.minPlayers = league.config.minPlayers
            self.maxPlayers = league.config.maxPlayers
            self.entryFee = league.config.entryFee
            self.maxStakePerUser = league.config.maxStakePerUser
            self.allowNFTs = league.config.allowNFTs
          }
        }
        
        access(all) fun main(): [LeagueWithId] {
          let leagues: [LeagueWithId] = []
          let leagueIds = LeagueFactory.getLeagueIds()
          
          for leagueId in leagueIds {
            if let league = LeagueFactory.getLeagueDetails(leagueId: leagueId) {
              leagues.append(LeagueWithId(id: leagueId, league: league))
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

  /**
   * Join a league and stake tokens
   */
  async joinLeague(leagueId, playerAddress, amount) {
    try {
      const transaction = `
        import LeagueFactory from ${this.leagueFactoryAddress}
        
        transaction(leagueId: UInt64, amount: UFix64) {
          let playerAddress: Address
          
          prepare(signer: auth(Storage) &Account) {
            self.playerAddress = signer.address
          }
          
          execute {
            // Get league reference
            let league = LeagueFactory.getLeagueDetails(leagueId: leagueId)
              ?? panic("League not found")
            
            // Add player to league participants
            league.addParticipant(player: self.playerAddress)
            
            log("Successfully joined league")
            log("Player: ".concat(self.playerAddress.toString()))
            log("League ID: ".concat(leagueId.toString()))
            log("Amount: ".concat(amount.toString()))
          }
        }
      `;
      
      // This needs to be called from frontend with user authorization
      // For backend, we return the transaction code
      return {
        transaction,
        args: [
          { value: leagueId.toString(), type: 'UInt64' },
          { value: amount.toString(), type: 'UFix64' }
        ]
      };
    } catch (error) {
      console.error('Error joining league:', error);
      throw new Error(`Failed to join league: ${error.message}`);
    }
  }

  /**
   * Schedule settlement for a league
   */
  async scheduleSettlement(leagueId, scheduledTime, winners) {
    try {
      const transaction = `
        import Settlement from ${this.settlementAddress}
        import LeagueFactory from ${this.leagueFactoryAddress}
        
        transaction(leagueId: UInt64, winners: [Address]) {
          prepare(signer: auth(Storage) &Account) {
            // Only league creator or admin can schedule settlement
          }
          
          execute {
            // Get league reference
            let league = LeagueFactory.getLeagueDetails(leagueId: leagueId)
              ?? panic("League not found")
            
            // Finalize league with winners
            league.finalizeLeague(winners: winners)
            
            // Schedule settlement transaction
            Settlement.scheduleSettlement(
              leagueId: leagueId,
              winners: winners
            )
            
            log("Settlement scheduled successfully")
          }
        }
      `;
      
      return {
        transaction,
        args: [
          { value: leagueId.toString(), type: 'UInt64' },
          { value: winners, type: '[Address]' }
        ]
      };
    } catch (error) {
      console.error('Error scheduling settlement:', error);
      throw new Error(`Failed to schedule settlement: ${error.message}`);
    }
  }

  /**
   * Submit lineup for a league
   */
  async submitLineup(leagueId, playerAddress, lineup) {
    try {
      const transaction = `
        import LeagueFactory from ${this.leagueFactoryAddress}
        
        transaction(leagueId: UInt64, playerIds: [UInt64], positions: [String]) {
          let playerAddress: Address
          
          prepare(signer: auth(Storage) &Account) {
            self.playerAddress = signer.address
          }
          
          execute {
            // Get league reference
            let league = LeagueFactory.getLeagueDetails(leagueId: leagueId)
              ?? panic("League not found")
            
            // Create lineup struct
            let lineup = LeagueFactory.PlayerLineup(
              playerIds: playerIds,
              positions: positions,
              submittedAt: getCurrentBlock().timestamp
            )
            
            // Submit lineup
            league.submitLineup(player: self.playerAddress, lineup: lineup)
            
            log("Lineup submitted successfully")
          }
        }
      `;
      
      return {
        transaction,
        args: [
          { value: leagueId.toString(), type: 'UInt64' },
          { value: lineup.playerIds, type: '[UInt64]' },
          { value: lineup.positions, type: '[String]' }
        ]
      };
    } catch (error) {
      console.error('Error submitting lineup:', error);
      throw new Error(`Failed to submit lineup: ${error.message}`);
    }
  }
}

module.exports = new FlowService();
