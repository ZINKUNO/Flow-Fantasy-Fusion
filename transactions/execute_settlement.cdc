import LeagueFactory from "../contracts/LeagueFactory.cdc"
import StakingManager from "../contracts/StakingManager.cdc"
import Settlement from "../contracts/Settlement.cdc"

transaction(
    leagueId: UInt64,
    performanceData: {UInt64: UFix64}
) {
    let settlementEngine: &Settlement.SettlementEngine
    let leagueCollection: &LeagueFactory.LeagueCollection
    let stakeVault: &StakingManager.StakeVault
    
    prepare(signer: AuthAccount) {
        self.settlementEngine = signer.borrow<&Settlement.SettlementEngine>(
            from: Settlement.SettlementStoragePath
        ) ?? panic("Could not borrow settlement engine")
        
        self.leagueCollection = signer.borrow<&LeagueFactory.LeagueCollection>(
            from: LeagueFactory.LeagueStoragePath
        ) ?? panic("Could not borrow league collection")
        
        self.stakeVault = signer.borrow<&StakingManager.StakeVault>(
            from: StakingManager.StakeManagerStoragePath
        ) ?? panic("Could not borrow stake vault")
    }
    
    execute {
        let league = self.leagueCollection.borrowLeague(leagueId: leagueId)
            ?? panic("League not found")
        
        // Execute settlement
        let result = self.settlementEngine.executeSettlement(
            leagueId: leagueId,
            lineups: league.lineups,
            performanceData: performanceData,
            totalPrizePool: league.totalStaked
        )
        
        // Distribute payouts
        self.stakeVault.distributePayout(
            leagueId: leagueId,
            winners: result.payouts
        )
        
        // Finalize league
        league.finalizeLeague(winners: result.rankings)
        
        log("Settlement executed for league ".concat(leagueId.toString()))
    }
}
