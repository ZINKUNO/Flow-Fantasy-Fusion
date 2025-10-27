import LeagueFactory from "../contracts/LeagueFactory.cdc"
import Settlement from "../contracts/Settlement.cdc"

transaction(
    leagueId: UInt64,
    scheduledTime: UFix64,
    txId: String
) {
    let settlementEngine: &Settlement.SettlementEngine
    let leagueCollection: &LeagueFactory.LeagueCollection
    
    prepare(signer: AuthAccount) {
        // Get or create settlement engine
        if signer.borrow<&Settlement.SettlementEngine>(from: Settlement.SettlementStoragePath) == nil {
            let engine <- Settlement.createSettlementEngine()
            signer.save(<-engine, to: Settlement.SettlementStoragePath)
        }
        
        self.settlementEngine = signer.borrow<&Settlement.SettlementEngine>(
            from: Settlement.SettlementStoragePath
        ) ?? panic("Could not borrow settlement engine")
        
        self.leagueCollection = signer.borrow<&LeagueFactory.LeagueCollection>(
            from: LeagueFactory.LeagueStoragePath
        ) ?? panic("Could not borrow league collection")
    }
    
    execute {
        // Schedule settlement using Forte Scheduled Transactions
        self.settlementEngine.scheduleSettlement(
            leagueId: leagueId,
            scheduledTime: scheduledTime,
            txId: txId
        )
        
        // Update league status
        if let league = self.leagueCollection.borrowLeague(leagueId: leagueId) {
            league.scheduleSettlement(txId: txId)
        }
        
        log("Settlement scheduled for league ".concat(leagueId.toString()).concat(" at time ").concat(scheduledTime.toString()))
    }
}
