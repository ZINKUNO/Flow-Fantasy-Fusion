// Settlement.cdc
// Contract for automated league settlement and winner determination
// Fresh Code - Built for Forte Hacks with Scheduled Transactions support

import LeagueFactory from "./LeagueFactory.cdc"
import StakingManager from "./StakingManager.cdc"

pub contract Settlement {
    
    // Events
    pub event SettlementInitiated(leagueId: UInt64, timestamp: UFix64)
    pub event ScoresCalculated(leagueId: UInt64, scores: {Address: UFix64})
    pub event WinnersDetermined(leagueId: UInt64, winners: [Address], payouts: {Address: UFix64})
    pub event SettlementCompleted(leagueId: UInt64, totalPayout: UFix64)
    pub event SettlementScheduled(leagueId: UInt64, scheduledTime: UFix64, txId: String)
    
    // Storage paths
    pub let SettlementStoragePath: StoragePath
    pub let SettlementAdminPath: StoragePath
    
    // Settlement status
    pub enum SettlementStatus: UInt8 {
        pub case NotStarted
        pub case Calculating
        pub case Completed
        pub case Failed
    }
    
    // Player score structure
    pub struct PlayerScore {
        pub let player: Address
        pub var score: UFix64
        pub let breakdown: {String: UFix64}  // category -> points
        
        init(player: Address, score: UFix64, breakdown: {String: UFix64}) {
            self.player = player
            self.score = score
            self.breakdown = breakdown
        }
        
        pub fun updateScore(newScore: UFix64) {
            self.score = newScore
        }
    }
    
    // Settlement result
    pub struct SettlementResult {
        pub let leagueId: UInt64
        pub let scores: {Address: PlayerScore}
        pub let rankings: [Address]  // sorted by score
        pub let payouts: {Address: UFix64}
        pub let timestamp: UFix64
        pub let status: SettlementStatus
        
        init(
            leagueId: UInt64,
            scores: {Address: PlayerScore},
            rankings: [Address],
            payouts: {Address: UFix64}
        ) {
            self.leagueId = leagueId
            self.scores = scores
            self.rankings = rankings
            self.payouts = payouts
            self.timestamp = getCurrentBlock().timestamp
            self.status = SettlementStatus.Completed
        }
    }
    
    // Scheduled settlement info
    pub struct ScheduledSettlement {
        pub let leagueId: UInt64
        pub let scheduledTime: UFix64
        pub let txId: String
        pub var executed: Bool
        
        init(leagueId: UInt64, scheduledTime: UFix64, txId: String) {
            self.leagueId = leagueId
            self.scheduledTime = scheduledTime
            self.txId = txId
            self.executed = false
        }
        
        pub fun markExecuted() {
            self.executed = true
        }
    }
    
    // Settlement engine resource
    pub resource SettlementEngine {
        access(self) let settlementResults: {UInt64: SettlementResult}
        access(self) let scheduledSettlements: {UInt64: ScheduledSettlement}
        
        init() {
            self.settlementResults = {}
            self.scheduledSettlements = {}
        }
        
        // Schedule a settlement for a specific time (Forte Scheduled Transaction)
        pub fun scheduleSettlement(
            leagueId: UInt64,
            scheduledTime: UFix64,
            txId: String
        ) {
            pre {
                scheduledTime > getCurrentBlock().timestamp:
                    "Scheduled time must be in the future"
                self.scheduledSettlements[leagueId] == nil:
                    "Settlement already scheduled for this league"
            }
            
            let scheduled = ScheduledSettlement(
                leagueId: leagueId,
                scheduledTime: scheduledTime,
                txId: txId
            )
            
            self.scheduledSettlements[leagueId] = scheduled
            
            emit SettlementScheduled(
                leagueId: leagueId,
                scheduledTime: scheduledTime,
                txId: txId
            )
        }
        
        // Calculate scores for all participants
        pub fun calculateScores(
            leagueId: UInt64,
            lineups: {Address: LeagueFactory.PlayerLineup},
            performanceData: {UInt64: UFix64}  // playerId/nftId -> performance score
        ): {Address: PlayerScore} {
            emit SettlementInitiated(leagueId: leagueId, timestamp: getCurrentBlock().timestamp)
            
            let scores: {Address: PlayerScore} = {}
            
            for player in lineups.keys {
                let lineup = lineups[player]!
                var totalScore: UFix64 = 0.0
                let breakdown: {String: UFix64} = {}
                
                // Calculate score for each position
                for position in lineup.positions.keys {
                    let playerIds = lineup.positions[position]!
                    var positionScore: UFix64 = 0.0
                    
                    for playerId in playerIds {
                        let performance = performanceData[playerId] ?? 0.0
                        positionScore = positionScore + performance
                    }
                    
                    breakdown[position] = positionScore
                    totalScore = totalScore + positionScore
                }
                
                // Apply AI suggestion bonus if used
                if lineup.aiSuggested {
                    totalScore = totalScore * 1.05  // 5% bonus for AI suggestions
                    breakdown["ai_bonus"] = totalScore * 0.05
                }
                
                scores[player] = PlayerScore(
                    player: player,
                    score: totalScore,
                    breakdown: breakdown
                )
            }
            
            emit ScoresCalculated(
                leagueId: leagueId,
                scores: self.extractScoreValues(scores)
            )
            
            return scores
        }
        
        // Determine winners and calculate payouts
        pub fun determineWinners(
            leagueId: UInt64,
            scores: {Address: PlayerScore},
            totalPrizePool: UFix64
        ): {Address: UFix64} {
            // Sort players by score
            let rankings = self.sortPlayersByScore(scores)
            
            // Calculate payouts (top 3 winners)
            let payouts: {Address: UFix64} = {}
            
            if rankings.length >= 1 {
                // 1st place: 60% of prize pool
                payouts[rankings[0]] = totalPrizePool * 0.60
            }
            
            if rankings.length >= 2 {
                // 2nd place: 25% of prize pool
                payouts[rankings[1]] = totalPrizePool * 0.25
            }
            
            if rankings.length >= 3 {
                // 3rd place: 15% of prize pool
                payouts[rankings[2]] = totalPrizePool * 0.15
            }
            
            emit WinnersDetermined(
                leagueId: leagueId,
                winners: rankings,
                payouts: payouts
            )
            
            return payouts
        }
        
        // Execute settlement
        pub fun executeSettlement(
            leagueId: UInt64,
            lineups: {Address: LeagueFactory.PlayerLineup},
            performanceData: {UInt64: UFix64},
            totalPrizePool: UFix64
        ): SettlementResult {
            // Calculate scores
            let scores = self.calculateScores(
                leagueId: leagueId,
                lineups: lineups,
                performanceData: performanceData
            )
            
            // Determine winners and payouts
            let payouts = self.determineWinners(
                leagueId: leagueId,
                scores: scores,
                totalPrizePool: totalPrizePool
            )
            
            // Create rankings
            let rankings = self.sortPlayersByScore(scores)
            
            // Create settlement result
            let result = SettlementResult(
                leagueId: leagueId,
                scores: scores,
                rankings: rankings,
                payouts: payouts
            )
            
            self.settlementResults[leagueId] = result
            
            // Mark scheduled settlement as executed
            if let scheduled = self.scheduledSettlements[leagueId] {
                scheduled.markExecuted()
            }
            
            var totalPayout: UFix64 = 0.0
            for payout in payouts.values {
                totalPayout = totalPayout + payout
            }
            
            emit SettlementCompleted(leagueId: leagueId, totalPayout: totalPayout)
            
            return result
        }
        
        // Get settlement result
        pub fun getSettlementResult(leagueId: UInt64): SettlementResult? {
            return self.settlementResults[leagueId]
        }
        
        // Get scheduled settlement
        pub fun getScheduledSettlement(leagueId: UInt64): ScheduledSettlement? {
            return self.scheduledSettlements[leagueId]
        }
        
        // Helper: sort players by score (descending)
        access(self) fun sortPlayersByScore(_ scores: {Address: PlayerScore}): [Address] {
            let players: [Address] = scores.keys
            
            // Simple bubble sort (sufficient for small player counts in hackathon)
            var i = 0
            while i < players.length {
                var j = 0
                while j < players.length - i - 1 {
                    let score1 = scores[players[j]]!.score
                    let score2 = scores[players[j + 1]]!.score
                    
                    if score1 < score2 {
                        let temp = players[j]
                        players[j] = players[j + 1]
                        players[j + 1] = temp
                    }
                    j = j + 1
                }
                i = i + 1
            }
            
            return players
        }
        
        // Helper: extract score values for event
        access(self) fun extractScoreValues(_ scores: {Address: PlayerScore}): {Address: UFix64} {
            let values: {Address: UFix64} = {}
            for player in scores.keys {
                values[player] = scores[player]!.score
            }
            return values
        }
    }
    
    // Public interface
    pub resource interface SettlementEnginePublic {
        pub fun getSettlementResult(leagueId: UInt64): SettlementResult?
        pub fun getScheduledSettlement(leagueId: UInt64): ScheduledSettlement?
    }
    
    // Create empty settlement engine
    pub fun createSettlementEngine(): @SettlementEngine {
        return <- create SettlementEngine()
    }
    
    // Admin resource
    pub resource Admin {
        // Admin can trigger manual settlements if needed
        pub fun forceSettlement(leagueId: UInt64) {
            // Implementation for manual override
        }
    }
    
    init() {
        self.SettlementStoragePath = /storage/SettlementEngine
        self.SettlementAdminPath = /storage/SettlementAdmin
        
        // Create and save settlement engine
        let engine <- create SettlementEngine()
        self.account.save(<-engine, to: self.SettlementStoragePath)
        
        // Create and save admin
        let admin <- create Admin()
        self.account.save(<-admin, to: self.SettlementAdminPath)
    }
}
