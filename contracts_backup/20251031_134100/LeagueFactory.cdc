// LeagueFactory.cdc
// Contract for creating and managing fantasy sports leagues
// Fresh Code - Built for Forte Hacks

import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20

pub contract LeagueFactory {
    
    // Events
    pub event LeagueCreated(leagueId: UInt64, name: String, creator: Address, startTime: UFix64, endTime: UFix64)
    pub event PlayerJoinedLeague(leagueId: UInt64, player: Address)
    pub event LeagueStarted(leagueId: UInt64)
    pub event LeagueFinalized(leagueId: UInt64, winners: [Address])
    
    // Storage paths
    pub let AdminStoragePath: StoragePath
    pub let LeagueStoragePath: StoragePath
    pub let LeaguePublicPath: PublicPath
    
    // League status enum
    pub enum LeagueStatus: UInt8 {
        pub case Pending      // 0 - Created but not started
        pub case Active       // 1 - Started and accepting entries
        pub case InProgress   // 2 - Game is running
        pub case Finalizing   // 3 - Computing results
        pub case Completed    // 4 - Finished and payouts distributed
        pub case Cancelled    // 5 - Cancelled
    }
    
    // League configuration
    pub struct LeagueConfig {
        pub let minPlayers: UInt32
        pub let maxPlayers: UInt32
        pub let entryFee: UFix64
        pub let prizePool: UFix64
        pub let allowedTokens: [String]
        pub let allowNFTs: Bool
        pub let maxStakePerUser: UFix64
        
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
    pub struct PlayerLineup {
        pub let player: Address
        pub let positions: {String: [UInt64]} // position -> [player/nft ids]
        pub let aiSuggested: Bool
        pub let timestamp: UFix64
        
        init(player: Address, positions: {String: [UInt64]}, aiSuggested: Bool) {
            self.player = player
            self.positions = positions
            self.aiSuggested = aiSuggested
            self.timestamp = getCurrentBlock().timestamp
        }
    }
    
    // League resource
    pub resource League {
        pub let leagueId: UInt64
        pub let name: String
        pub let description: String
        pub let creator: Address
        pub let startTime: UFix64
        pub let endTime: UFix64
        pub var status: LeagueStatus
        pub let config: LeagueConfig
        pub let participants: [Address]
        pub let lineups: {Address: PlayerLineup}
        pub var totalStaked: UFix64
        pub var settlementScheduled: Bool
        pub var settlementTxId: String?
        
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
        
        pub fun addParticipant(player: Address) {
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
        
        pub fun submitLineup(player: Address, lineup: PlayerLineup) {
            pre {
                self.status == LeagueStatus.Active:
                    "League is not accepting lineups"
                self.participants.contains(player):
                    "Player not in league"
            }
            
            self.lineups[player] = lineup
        }
        
        pub fun startLeague() {
            pre {
                self.status == LeagueStatus.Pending:
                    "League already started"
                UInt32(self.participants.length) >= self.config.minPlayers:
                    "Not enough players"
            }
            
            self.status = LeagueStatus.Active
            emit LeagueStarted(leagueId: self.leagueId)
        }
        
        pub fun beginGame() {
            pre {
                self.status == LeagueStatus.Active:
                    "League not ready to begin"
                getCurrentBlock().timestamp >= self.startTime:
                    "Game start time not reached"
            }
            
            self.status = LeagueStatus.InProgress
        }
        
        pub fun scheduleSettlement(txId: String) {
            pre {
                self.status == LeagueStatus.InProgress:
                    "League not in progress"
                !self.settlementScheduled:
                    "Settlement already scheduled"
            }
            
            self.settlementScheduled = true
            self.settlementTxId = txId
        }
        
        pub fun finalizeLeague(winners: [Address]) {
            pre {
                self.status == LeagueStatus.InProgress || self.status == LeagueStatus.Finalizing:
                    "League not ready for finalization"
            }
            
            self.status = LeagueStatus.Completed
            emit LeagueFinalized(leagueId: self.leagueId, winners: winners)
        }
        
        pub fun updateTotalStaked(amount: UFix64) {
            self.totalStaked = self.totalStaked + amount
        }
        
        pub fun getParticipantCount(): Int {
            return self.participants.length
        }
        
        pub fun getLineup(player: Address): PlayerLineup? {
            return self.lineups[player]
        }
    }
    
    // League collection resource
    pub resource LeagueCollection {
        pub var leagues: @{UInt64: League}
        pub var nextLeagueId: UInt64
        
        init() {
            self.leagues <- {}
            self.nextLeagueId = 1
        }
        
        pub fun createLeague(
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
        
        pub fun borrowLeague(leagueId: UInt64): &League? {
            return &self.leagues[leagueId] as &League?
        }
        
        pub fun getLeagueIds(): [UInt64] {
            return self.leagues.keys
        }
        
        destroy() {
            destroy self.leagues
        }
    }
    
    // Public interface
    pub resource interface LeagueCollectionPublic {
        pub fun getLeagueIds(): [UInt64]
        pub fun borrowLeague(leagueId: UInt64): &League?
    }
    
    // Create empty league collection
    pub fun createEmptyLeagueCollection(): @LeagueCollection {
        return <- create LeagueCollection()
    }
    
    init() {
        self.AdminStoragePath = /storage/LeagueFactoryAdmin
        self.LeagueStoragePath = /storage/LeagueCollection
        self.LeaguePublicPath = /public/LeagueCollection
        
        // Create and store admin collection
        let collection <- create LeagueCollection()
        self.account.save(<-collection, to: self.LeagueStoragePath)
    }
}
