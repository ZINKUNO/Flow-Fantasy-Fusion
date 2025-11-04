import "FlowTransactionScheduler"
import "LeagueFactory"
import "Settlement"
import "FlowToken"
import "FungibleToken"

/// Handler for automated league settlement using Flow's scheduled transactions
access(all) contract SettlementTransactionHandler {
    
    /// Storage paths
    access(all) let HandlerStoragePath: StoragePath
    access(all) let HandlerPublicPath: PublicPath
    
    /// Handler resource that implements the Scheduled Transaction interface
    access(all) resource Handler: FlowTransactionScheduler.TransactionHandler {
        
        /// Execute settlement for a league
        /// This function is called automatically by FlowTransactionScheduler at the scheduled time
        access(FlowTransactionScheduler.Execute) fun executeTransaction(id: UInt64, data: AnyStruct?) {
            // Extract league ID from transaction data
            let leagueData = data as! {String: AnyStruct}
            let leagueId = leagueData["leagueId"]! as! UInt64
            
            log("Executing scheduled settlement for league: ".concat(leagueId.toString()))
            
            // Borrow settlement contract reference
            let settlementRef = Settlement.account.storage
                .borrow<&Settlement.SettlementManager>(from: Settlement.SettlementStoragePath)
                ?? panic("Could not borrow Settlement reference")
            
            // Execute settlement
            settlementRef.settleLeague(leagueId: leagueId)
            
            log("Settlement completed for league ".concat(leagueId.toString()).concat(" (scheduled tx id: ").concat(id.toString()).concat(")"))
        }
        
        /// Get metadata views
        access(all) view fun getViews(): [Type] {
            return [Type<StoragePath>(), Type<PublicPath>()]
        }
        
        /// Resolve metadata view
        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<StoragePath>():
                    return SettlementTransactionHandler.HandlerStoragePath
                case Type<PublicPath>():
                    return SettlementTransactionHandler.HandlerPublicPath
                default:
                    return nil
            }
        }
    }
    
    /// Factory function to create handler resource
    access(all) fun createHandler(): @Handler {
        return <- create Handler()
    }
    
    init() {
        self.HandlerStoragePath = /storage/SettlementTransactionHandler
        self.HandlerPublicPath = /public/SettlementTransactionHandler
    }
}
