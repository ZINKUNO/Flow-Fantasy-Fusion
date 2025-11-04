import "Settlement"
import "LeagueFactory"

/// Settle a league that has ended
/// This transaction is called by the backend settlement service
transaction(leagueId: UInt64) {
    
    let settlementRef: &Settlement.SettlementManager
    
    prepare(signer: auth(Storage) &Account) {
        // Borrow settlement manager reference
        self.settlementRef = signer.storage
            .borrow<&Settlement.SettlementManager>(from: Settlement.SettlementStoragePath)
            ?? panic("Could not borrow Settlement reference")
    }
    
    execute {
        // Execute settlement
        self.settlementRef.settleLeague(leagueId: leagueId)
        
        log("League ".concat(leagueId.toString()).concat(" settled successfully"))
    }
}
