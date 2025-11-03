import LeagueFactory from 0xf474649aaa285cf5

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
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Get or create league collection
        if signer.storage.borrow<&LeagueFactory.LeagueCollection>(from: LeagueFactory.LeagueStoragePath) == nil {
            let collection <- LeagueFactory.createEmptyLeagueCollection()
            signer.storage.save(<-collection, to: LeagueFactory.LeagueStoragePath)
        }
    }

    execute {
        // Create league config
        let config = LeagueFactory.LeagueConfig(
            minPlayers: minPlayers,
            maxPlayers: maxPlayers,
            entryFee: entryFee,
            allowedTokens: allowedTokens,
            allowNFTs: allowNFTs,
            maxStakePerUser: maxStakePerUser
        )

        // Get reference to league collection
        let collectionRef = getAccount(0xf474649aaa285cf5)
            .capabilities.borrow<&LeagueFactory.LeagueCollection>(LeagueFactory.LeagueStoragePath)
            ?? panic("Could not borrow league collection reference")

        // Create the league
        let leagueId = collectionRef.createLeague(
            name: name,
            description: description,
            creator: 0xf474649aaa285cf5,
            startTime: startTime,
            endTime: endTime,
            config: config
        )

        log("League created with ID: ".concat(leagueId.toString()))
    }
}
