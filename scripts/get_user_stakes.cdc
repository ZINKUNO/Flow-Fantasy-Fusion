import StakingManager from "../contracts/StakingManager.cdc"

// Get all stakes for a specific user
pub fun main(address: Address): [AnyStruct] {
    return StakingManager.getUserStakes(address: address)
}
