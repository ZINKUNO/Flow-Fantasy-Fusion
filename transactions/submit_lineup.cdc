import LeagueFactory from "../contracts/LeagueFactory.cdc"

transaction(
    leagueId: UInt64,
    positions: {String: [UInt64]},
    aiSuggested: Bool
) {
    let leagueCollection: &LeagueFactory.LeagueCollection
    
    prepare(signer: AuthAccount) {
        self.leagueCollection = signer.borrow<&LeagueFactory.LeagueCollection>(
            from: LeagueFactory.LeagueStoragePath
        ) ?? panic("Could not borrow league collection")
    }
    
    execute {
        let lineup = LeagueFactory.PlayerLineup(
            player: signer.address,
            positions: positions,
            aiSuggested: aiSuggested
        )
        
        if let league = self.leagueCollection.borrowLeague(leagueId: leagueId) {
            league.submitLineup(player: signer.address, lineup: lineup)
        } else {
            panic("League not found")
        }
        
        log("Lineup submitted for league ".concat(leagueId.toString()))
    }
}
