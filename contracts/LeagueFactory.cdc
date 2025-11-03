// LeagueFactory.cdc
// Contract for creating and managing fantasy sports leagues
// Fresh Code - Built for Forte Hacks

import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20

access(all) contract LeagueFactory {
    
    // Events
    access(all) event LeagueCreated(leagueId: UInt64, name: String, creator: Address, startTime: UFix64, endTime: UFix64)
    access(all) event PlayerJoinedLeague(leagueId: UInt64, player: Address)
    access(all) event LeagueStarted(leagueId: UInt64)
    access(all) event LeagueFinalized(leagueId: UInt64, winners: [Address])
    
    // Storage paths
    access(all) let AdminStoragePath: StoragePath
    access(all) let LeagueStoragePath: StoragePath
    access(all) let LeaguePublicPath: PublicPath
    
    // League status enum
    access(all) enum LeagueStatus: UInt8 {
        access(all) case Pending      // 0 - Created but not started
        access(all) case Active       // 1 - Started and accepting entries
        access(all) case InProgress   // 2 - Game is running
        access(all) case Finalizing   // 3 - Computing results
        access(all) case Completed    // 4 - Finished and payouts distributed
        access(all) case Cancelled    // 5 - Cancelled
    }
    
    // League configuration
    access(all) struct LeagueConfig {
        access(all) let minPlayers: UInt32
        access(all) let maxPlayers: UInt32
        access(all) let entryFee: UFix64
        access(all) let prizePool: UFix64
        access(all) let allowedTokens: [String]
        access(all) let allowNFTs: Bool
        access(all) let maxStakePerUser: UFix64
        
        init(
            minPlayers: UInt32,
            maxPlayers: UInt32,
            entryFee: UFix64,
            allowedTokens: [String],
            allowNFTs: Bool,
            maxStakePerUser: UFix64
        ) {
            self.minPlayers = minPlayers
            self.maxPlayers = maxPlayers
            self.entryFee = entryFee
            self.prizePool = 0.0
            self.allowedTokens = allowedTokens
            self.allowNFTs = allowNFTs
            self.maxStakePerUser = maxStakePerUser
        }
    }
    
    // Player lineup structure
    access(all) struct PlayerLineup {
        access(all) let player: Address
        access(all) let positions: {String: [UInt64]} // position -> [player/nft ids]
        access(all) let aiSuggested: Bool
        access(all) let timestamp: UFix64
        
        init(player: Address, positions: {String: [UInt64]}, aiSuggested: Bool) {
            self.player = player
            self.positions = positions
            self.aiSuggested = aiSuggested
            self.timestamp = getCurrentBlock().timestamp
        }
    }
    
    // League resource
    access(all) resource League {
        access(all) let leagueId: UInt64
        access(all) let name: String
        access(all) let description: String
        access(all) let creator: Address
        access(all) let startTime: UFix64
        access(all) let endTime: UFix64
        access(all) var status: LeagueStatus
        access(all) let config: LeagueConfig
        access(all) let participants: [Address]
        access(all) let lineups: {Address: PlayerLineup}
        access(all) var totalStaked: UFix64
        access(all) var settlementScheduled: Bool
        access(all) var settlementTxId: String?
        
        init(
            leagueId: UInt64,
            name: String,
            description: String,
            creator: Address,
            startTime: UFix64,
            endTime: UFix64,
            config: LeagueConfig
        ) {
            self.leagueId = leagueId
            self.name = name
            self.description = description
            self.creator = creator
            self.startTime = startTime
            self.endTime = endTime
            self.status = LeagueStatus.Pending
            self.config = config
            self.participants = []
            self.lineups = {}
            self.totalStaked = 0.0
            self.settlementScheduled = false
            self.settlementTxId = nil
        }
        
        access(all) fun addParticipant(player: Address) {
            pre {
                self.status == LeagueStatus.Pending || self.status == LeagueStatus.Active:
                    "League is not accepting new players"
                UInt32(self.participants.length) < self.config.maxPlayers:
                    "League is full"
                !self.participants.contains(player):
                    "Player already joined"
            }
            
            self.participants.append(player)
            emit PlayerJoinedLeague(leagueId: self.leagueId, player: player)
        }
        
        access(all) fun submitLineup(player: Address, lineup: PlayerLineup) {
            pre {
                self.status == LeagueStatus.Active:
                    "League is not accepting lineups"
                self.participants.contains(player):
                    "Player not in league"
            }
            
            self.lineups[player] = lineup
        }
        
        access(all) fun startLeague() {
            pre {
                self.status == LeagueStatus.Pending:
                    "League already started"
                UInt32(self.participants.length) >= self.config.minPlayers:
                    "Not enough players"
            }
            
            self.status = LeagueStatus.Active
            emit LeagueStarted(leagueId: self.leagueId)
        }
        
        access(all) fun beginGame() {
            pre {
                self.status == LeagueStatus.Active:
                    "League not ready to begin"
                getCurrentBlock().timestamp >= self.startTime:
                    "Game start time not reached"
            }
            
            self.status = LeagueStatus.InProgress
        }
        
        access(all) fun scheduleSettlement(txId: String) {
            pre {
                self.status == LeagueStatus.InProgress:
                    "League not in progress"
                !self.settlementScheduled:
                    "Settlement already scheduled"
            }
            
            self.settlementScheduled = true
            self.settlementTxId = txId
        }
        
        access(all) fun finalizeLeague(winners: [Address]) {
            pre {
                self.status == LeagueStatus.InProgress || self.status == LeagueStatus.Finalizing:
                    "League not ready for finalization"
            }
            
            self.status = LeagueStatus.Completed
            emit LeagueFinalized(leagueId: self.leagueId, winners: winners)
        }
        
        access(all) fun updateTotalStaked(amount: UFix64) {
            self.totalStaked = self.totalStaked + amount
        }
        
        access(all) fun getParticipantCount(): Int {
            return self.participants.length
        }
        
        access(all) fun getLineup(player: Address): PlayerLineup? {
            return self.lineups[player]
        }
    }
    
    // League collection resource
    access(all) resource LeagueCollection {
        access(all) var leagues: @{UInt64: League}
        access(all) var nextLeagueId: UInt64
        
        init() {
            self.leagues <- {}
            self.nextLeagueId = 1
        }
        
        access(all) fun createLeague(
            name: String,
            description: String,
            creator: Address,
            startTime: UFix64,
            endTime: UFix64,
            config: LeagueConfig
        ): UInt64 {
            let leagueId = self.nextLeagueId
            let newLeague <- create League(
                leagueId: leagueId,
                name: name,
                description: description,
                creator: creator,
                startTime: startTime,
                endTime: endTime,
                config: config
            )
            
            self.leagues[leagueId] <-! newLeague
            self.nextLeagueId = self.nextLeagueId + 1
            
            emit LeagueCreated(
                leagueId: leagueId,
                name: name,
                creator: creator,
                startTime: startTime,
                endTime: endTime
            )
            
            return leagueId
        }
        
        access(all) fun borrowLeague(leagueId: UInt64): &League? {
            return &self.leagues[leagueId] as &League?
        }
        
        access(all) fun getLeagueIds(): [UInt64] {
            return self.leagues.keys
        }
        
    }
    
    // Public interface
    access(all) resource interface LeagueCollectionPublic {
        access(all) fun getLeagueIds(): [UInt64]
        access(all) fun borrowLeague(leagueId: UInt64): &League?
    }
    
    // Create empty league collection
    access(all) fun createEmptyLeagueCollection(): @LeagueCollection {
        return <- create LeagueCollection()
    }
    
    // Public function to create a league (callable by anyone)
    access(all) fun createLeaguePublic(
        name: String,
        description: String,
        creator: Address,
        startTime: UFix64,
        endTime: UFix64,
        config: LeagueConfig
    ): UInt64 {
        let collectionRef = self.account.storage.borrow<&LeagueCollection>(
            from: self.LeagueStoragePath
        ) ?? panic("Could not borrow league collection")
        
        return collectionRef.createLeague(
            name: name,
            description: description,
            creator: creator,
            startTime: startTime,
            endTime: endTime,
            config: config
        )
    }
    
    // Public function to get all league IDs
    access(all) fun getLeagueIds(): [UInt64] {
        let collectionRef = self.account.storage.borrow<&LeagueCollection>(
            from: self.LeagueStoragePath
        ) ?? panic("Could not borrow league collection")
        
        return collectionRef.getLeagueIds()
    }
    
    // Public function to get league details
    access(all) fun getLeagueDetails(leagueId: UInt64): &League? {
        let collectionRef = self.account.storage.borrow<&LeagueCollection>(
            from: self.LeagueStoragePath
        ) ?? panic("Could not borrow league collection")
        
        return collectionRef.borrowLeague(leagueId: leagueId)
    }
    
    init() {
        self.AdminStoragePath = /storage/LeagueFactoryAdmin
        self.LeagueStoragePath = /storage/LeagueCollection
        self.LeaguePublicPath = /public/LeagueCollection
        
        // Create and store admin collection
        let collection <- create LeagueCollection()
        self.account.storage.save(<-collection, to: self.LeagueStoragePath)
    }
}
