import "SettlementTransactionHandler"
import "FlowTransactionScheduler"

/// Initialize the settlement transaction handler in the signer's account
transaction() {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Save a handler resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: SettlementTransactionHandler.HandlerStoragePath) == nil {
            let handler <- SettlementTransactionHandler.createHandler()
            signer.storage.save(<-handler, to: SettlementTransactionHandler.HandlerStoragePath)
            
            // Issue an entitled capability for FlowTransactionScheduler to execute
            let _ = signer.capabilities.storage
                .issue<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>(
                    SettlementTransactionHandler.HandlerStoragePath
                )
            
            // Issue a non-entitled public capability for the handler
            let publicCap = signer.capabilities.storage
                .issue<&{FlowTransactionScheduler.TransactionHandler}>(
                    SettlementTransactionHandler.HandlerStoragePath
                )
            
            // Publish the capability
            signer.capabilities.publish(publicCap, at: SettlementTransactionHandler.HandlerPublicPath)
            
            log("Settlement handler initialized")
        } else {
            log("Settlement handler already exists")
        }
    }
}
