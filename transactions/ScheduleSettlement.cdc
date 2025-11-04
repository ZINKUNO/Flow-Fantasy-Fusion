import "FlowTransactionScheduler"
import "FlowTransactionSchedulerUtils"
import "SettlementTransactionHandler"
import "FlowToken"
import "FungibleToken"

/// Schedule automated settlement for a league using Flow's scheduled transactions
transaction(
    leagueId: UInt64,
    settlementTime: UFix64,
    priority: UInt8,
    executionEffort: UInt64
) {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        
        // Convert priority to enum
        let pr = priority == 0
            ? FlowTransactionScheduler.Priority.High
            : priority == 1
                ? FlowTransactionScheduler.Priority.Medium
                : FlowTransactionScheduler.Priority.Low
        
        // Prepare transaction data
        let transactionData: {String: AnyStruct} = {
            "leagueId": leagueId
        }
        
        // Estimate fees
        let estimate = FlowTransactionScheduler.estimate(
            data: transactionData,
            timestamp: settlementTime,
            priority: pr,
            executionEffort: executionEffort
        )
        
        // Validate estimate
        assert(
            estimate.timestamp != nil || pr == FlowTransactionScheduler.Priority.Low,
            message: estimate.error ?? "estimation failed"
        )
        
        // Withdraw fees from signer's vault
        let vaultRef = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("missing FlowToken vault")
        let fees <- vaultRef.withdraw(amount: estimate.flowFee ?? 0.0) as! @FlowToken.Vault
        
        // Create manager if it doesn't exist
        if !signer.storage.check<@{FlowTransactionSchedulerUtils.Manager}>(from: FlowTransactionSchedulerUtils.managerStoragePath) {
            let manager <- FlowTransactionSchedulerUtils.createManager()
            signer.storage.save(<-manager, to: FlowTransactionSchedulerUtils.managerStoragePath)
            
            // Create public capability to the manager
            let managerRef = signer.capabilities.storage
                .issue<&{FlowTransactionSchedulerUtils.Manager}>(FlowTransactionSchedulerUtils.managerStoragePath)
            signer.capabilities.publish(managerRef, at: FlowTransactionSchedulerUtils.managerPublicPath)
        }
        
        // Get the entitled handler capability
        var handlerCap: Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>? = nil
        let controllers = signer.capabilities.storage.getControllers(forPath: SettlementTransactionHandler.HandlerStoragePath)
        
        if let cap = controllers[0].capability as? Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}> {
            handlerCap = cap
        } else if controllers.length > 1 {
            handlerCap = controllers[1].capability as! Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>
        } else {
            panic("No entitled handler capability found")
        }
        
        // Borrow manager and schedule the transaction
        let manager = signer.storage
            .borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(
                from: FlowTransactionSchedulerUtils.managerStoragePath
            )
            ?? panic("Could not borrow Manager reference")
        
        manager.schedule(
            handlerCap: handlerCap,
            data: transactionData,
            timestamp: settlementTime,
            priority: pr,
            executionEffort: executionEffort,
            fees: <-fees
        )
        
        log("Scheduled settlement for league ".concat(leagueId.toString()).concat(" at ").concat(settlementTime.toString()))
    }
}
