// StakingManager.cdc
// Contract for managing token and NFT stakes in fantasy leagues
// Fresh Code - Built for Forte Hacks

import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import LeagueFactory from "./LeagueFactory.cdc"

pub contract StakingManager {
    
    // Events
    pub event TokensStaked(leagueId: UInt64, player: Address, amount: UFix64, tokenType: String)
    pub event NFTStaked(leagueId: UInt64, player: Address, nftId: UInt64, collectionType: String)
    pub event StakeReleased(leagueId: UInt64, player: Address, amount: UFix64)
    pub event PayoutDistributed(leagueId: UInt64, winner: Address, amount: UFix64)
    
    // Storage paths
    pub let StakeManagerStoragePath: StoragePath
    pub let StakeManagerPublicPath: PublicPath
    
    // Maximum stakes and limits
    pub var maxStakePerUser: UFix64
    pub var minStakeAmount: UFix64
    pub let allowedTokenTypes: {String: Bool}
    
    // Stake record structure
    pub struct StakeRecord {
        pub let leagueId: UInt64
        pub let player: Address
        pub let amount: UFix64
        pub let tokenType: String
        pub let timestamp: UFix64
        pub var released: Bool
        
        init(leagueId: UInt64, player: Address, amount: UFix64, tokenType: String) {
            self.leagueId = leagueId
            self.player = player
            self.amount = amount
            self.tokenType = tokenType
            self.timestamp = getCurrentBlock().timestamp
            self.released = false
        }
        
        pub fun markReleased() {
            self.released = true
        }
    }
    
    // NFT stake record
    pub struct NFTStakeRecord {
        pub let leagueId: UInt64
        pub let player: Address
        pub let nftId: UInt64
        pub let collectionType: String
        pub let timestamp: UFix64
        pub var released: Bool
        
        init(leagueId: UInt64, player: Address, nftId: UInt64, collectionType: String) {
            self.leagueId = leagueId
            self.player = player
            self.nftId = nftId
            self.collectionType = collectionType
            self.timestamp = getCurrentBlock().timestamp
            self.released = false
        }
        
        pub fun markReleased() {
            self.released = true
        }
    }
    
    // Stake vault resource for holding tokens
    pub resource StakeVault {
        // League ID -> Player Address -> Stakes
        access(self) let tokenStakes: {UInt64: {Address: [StakeRecord]}}
        access(self) let nftStakes: {UInt64: {Address: [NFTStakeRecord]}}
        
        // Escrow balances
        access(self) let escrowBalances: {UInt64: UFix64}
        
        init() {
            self.tokenStakes = {}
            self.nftStakes = {}
            self.escrowBalances = {}
        }
        
        // Stake tokens for a league
        pub fun stakeTokens(
            leagueId: UInt64,
            player: Address,
            amount: UFix64,
            tokenType: String
        ) {
            pre {
                amount >= StakingManager.minStakeAmount:
                    "Stake amount below minimum"
                amount <= StakingManager.maxStakePerUser:
                    "Stake amount exceeds maximum"
                StakingManager.allowedTokenTypes[tokenType] == true:
                    "Token type not allowed"
            }
            
            // Initialize league stakes if needed
            if self.tokenStakes[leagueId] == nil {
                self.tokenStakes[leagueId] = {}
            }
            
            if self.tokenStakes[leagueId]![player] == nil {
                self.tokenStakes[leagueId]!.insert(key: player, [])
            }
            
            // Check total stake for user in this league
            let existingStakes = self.tokenStakes[leagueId]![player]!
            var totalStaked: UFix64 = 0.0
            for stake in existingStakes {
                totalStaked = totalStaked + stake.amount
            }
            
            assert(
                totalStaked + amount <= StakingManager.maxStakePerUser,
                message: "Total stake would exceed maximum per user"
            )
            
            // Create stake record
            let stake = StakeRecord(
                leagueId: leagueId,
                player: player,
                amount: amount,
                tokenType: tokenType
            )
            
            self.tokenStakes[leagueId]![player]!.append(stake)
            
            // Update escrow balance
            if self.escrowBalances[leagueId] == nil {
                self.escrowBalances[leagueId] = 0.0
            }
            self.escrowBalances[leagueId] = self.escrowBalances[leagueId]! + amount
            
            emit TokensStaked(
                leagueId: leagueId,
                player: player,
                amount: amount,
                tokenType: tokenType
            )
        }
        
        // Stake NFT for a league
        pub fun stakeNFT(
            leagueId: UInt64,
            player: Address,
            nftId: UInt64,
            collectionType: String
        ) {
            // Initialize league NFT stakes if needed
            if self.nftStakes[leagueId] == nil {
                self.nftStakes[leagueId] = {}
            }
            
            if self.nftStakes[leagueId]![player] == nil {
                self.nftStakes[leagueId]!.insert(key: player, [])
            }
            
            // Create NFT stake record
            let nftStake = NFTStakeRecord(
                leagueId: leagueId,
                player: player,
                nftId: nftId,
                collectionType: collectionType
            )
            
            self.nftStakes[leagueId]![player]!.append(nftStake)
            
            emit NFTStaked(
                leagueId: leagueId,
                player: player,
                nftId: nftId,
                collectionType: collectionType
            )
        }
        
        // Get total staked for a league
        pub fun getTotalStaked(leagueId: UInt64): UFix64 {
            return self.escrowBalances[leagueId] ?? 0.0
        }
        
        // Get player stakes
        pub fun getPlayerStakes(leagueId: UInt64, player: Address): [StakeRecord] {
            if let leagueStakes = self.tokenStakes[leagueId] {
                return leagueStakes[player] ?? []
            }
            return []
        }
        
        // Get player NFT stakes
        pub fun getPlayerNFTStakes(leagueId: UInt64, player: Address): [NFTStakeRecord] {
            if let leagueNFTStakes = self.nftStakes[leagueId] {
                return leagueNFTStakes[player] ?? []
            }
            return []
        }
        
        // Release stakes (called by settlement)
        pub fun releaseStakes(leagueId: UInt64, player: Address): UFix64 {
            var totalReleased: UFix64 = 0.0
            
            if let leagueStakes = self.tokenStakes[leagueId] {
                if let playerStakes = leagueStakes[player] {
                    for stake in playerStakes {
                        if !stake.released {
                            totalReleased = totalReleased + stake.amount
                            stake.markReleased()
                        }
                    }
                }
            }
            
            emit StakeReleased(leagueId: leagueId, player: player, amount: totalReleased)
            return totalReleased
        }
        
        // Distribute payout to winners
        pub fun distributePayout(leagueId: UInt64, winners: {Address: UFix64}) {
            let totalEscrow = self.escrowBalances[leagueId] ?? 0.0
            var totalDistributed: UFix64 = 0.0
            
            for winner in winners.keys {
                let payoutAmount = winners[winner]!
                
                assert(
                    totalDistributed + payoutAmount <= totalEscrow,
                    message: "Payout exceeds escrow balance"
                )
                
                totalDistributed = totalDistributed + payoutAmount
                
                emit PayoutDistributed(
                    leagueId: leagueId,
                    winner: winner,
                    amount: payoutAmount
                )
            }
            
            // Update escrow balance
            self.escrowBalances[leagueId] = totalEscrow - totalDistributed
        }
        
        // Get all stakes for a league
        pub fun getAllLeagueStakes(leagueId: UInt64): {Address: [StakeRecord]} {
            return self.tokenStakes[leagueId] ?? {}
        }
    }
    
    // Public interface
    pub resource interface StakeVaultPublic {
        pub fun getTotalStaked(leagueId: UInt64): UFix64
        pub fun getPlayerStakes(leagueId: UInt64, player: Address): [StakeRecord]
    }
    
    // Admin resource for managing stake parameters
    pub resource Admin {
        pub fun updateMaxStakePerUser(newMax: UFix64) {
            StakingManager.maxStakePerUser = newMax
        }
        
        pub fun updateMinStakeAmount(newMin: UFix64) {
            StakingManager.minStakeAmount = newMin
        }
        
        pub fun addAllowedTokenType(tokenType: String) {
            StakingManager.allowedTokenTypes[tokenType] = true
        }
        
        pub fun removeAllowedTokenType(tokenType: String) {
            StakingManager.allowedTokenTypes.remove(key: tokenType)
        }
    }
    
    // Create empty stake vault
    pub fun createEmptyStakeVault(): @StakeVault {
        return <- create StakeVault()
    }
    
    init() {
        self.StakeManagerStoragePath = /storage/StakeManager
        self.StakeManagerPublicPath = /public/StakeManager
        
        // Initialize default parameters
        self.maxStakePerUser = 10000.0  // 10,000 tokens max
        self.minStakeAmount = 1.0       // 1 token minimum
        self.allowedTokenTypes = {
            "FLOW": true,
            "FUSD": true,
            "USDC": true
        }
        
        // Create and save stake vault
        let vault <- create StakeVault()
        self.account.save(<-vault, to: self.StakeManagerStoragePath)
        
        // Create and save admin
        let admin <- create Admin()
        self.account.save(<-admin, to: /storage/StakingAdmin)
    }
}
