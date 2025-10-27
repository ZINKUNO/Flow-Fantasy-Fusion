import LeagueFactory from "../contracts/LeagueFactory.cdc"

transaction(
    name: String,
    description: String,
    startTime: UFix64,
    endTime: UFix64,
    minPlayers: UInt32,
    maxPlayers: UInt32,
    entryFee: UFix64,
    allowedTokens: [String],
    allowNFTs: Bool,
    maxStakePerUser: UFix64
) {
    let leagueCollection: &LeagueFactory.LeagueCollection
    
    prepare(signer: AuthAccount) {
        // Get or create league collection
        if signer.borrow<&LeagueFactory.LeagueCollection>(from: LeagueFactory.LeagueStoragePath) == nil {
            let collection <- LeagueFactory.createEmptyLeagueCollection()
            signer.save(<-collection, to: LeagueFactory.LeagueStoragePath)
            signer.link<&{LeagueFactory.LeagueCollectionPublic}>(
                LeagueFactory.LeaguePublicPath,
                target: LeagueFactory.LeagueStoragePath
            )
        }
        
        self.leagueCollection = signer.borrow<&LeagueFactory.LeagueCollection>(
            from: LeagueFactory.LeagueStoragePath
        ) ?? panic("Could not borrow league collection")
    }
    
    execute {
        let config = LeagueFactory.LeagueConfig(
            minPlayers: minPlayers,
            maxPlayers: maxPlayers,
            entryFee: entryFee,
            allowedTokens: allowedTokens,
            allowNFTs: allowNFTs,
            maxStakePerUser: maxStakePerUser
        )
        
        let leagueId = self.leagueCollection.createLeague(
            name: name,
            description: description,
            creator: signer.address,
            startTime: startTime,
            endTime: endTime,
            config: config
        )
        
        log("League created with ID: ".concat(leagueId.toString()))
    }
}
