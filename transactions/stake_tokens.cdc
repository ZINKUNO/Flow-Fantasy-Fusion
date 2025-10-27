import LeagueFactory from "../contracts/LeagueFactory.cdc"
import StakingManager from "../contracts/StakingManager.cdc"

transaction(
    leagueId: UInt64,
    amount: UFix64,
    tokenType: String
) {
    let stakeVault: &StakingManager.StakeVault
    let leagueCollection: &LeagueFactory.LeagueCollection
    
    prepare(signer: AuthAccount) {
        // Get or create stake vault
        if signer.borrow<&StakingManager.StakeVault>(from: StakingManager.StakeManagerStoragePath) == nil {
            let vault <- StakingManager.createEmptyStakeVault()
            signer.save(<-vault, to: StakingManager.StakeManagerStoragePath)
            signer.link<&{StakingManager.StakeVaultPublic}>(
                StakingManager.StakeManagerPublicPath,
                target: StakingManager.StakeManagerStoragePath
            )
        }
        
        self.stakeVault = signer.borrow<&StakingManager.StakeVault>(
            from: StakingManager.StakeManagerStoragePath
        ) ?? panic("Could not borrow stake vault")
        
        // Borrow league collection
        self.leagueCollection = signer.borrow<&LeagueFactory.LeagueCollection>(
            from: LeagueFactory.LeagueStoragePath
        ) ?? panic("Could not borrow league collection")
    }
    
    execute {
        // Stake tokens
        self.stakeVault.stakeTokens(
            leagueId: leagueId,
            player: signer.address,
            amount: amount,
            tokenType: tokenType
        )
        
        // Add participant to league
        if let league = self.leagueCollection.borrowLeague(leagueId: leagueId) {
            league.addParticipant(player: signer.address)
            league.updateTotalStaked(amount: amount)
        }
        
        log("Staked ".concat(amount.toString()).concat(" ").concat(tokenType).concat(" for league ").concat(leagueId.toString()))
    }
}
