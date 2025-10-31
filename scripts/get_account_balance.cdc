import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7

// Get FLOW token balance for an account
pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
    
    return vaultRef?.balance ?? 0.0
}
