import LeagueFactory from "../contracts/LeagueFactory.cdc"

// Get all leagues with their details
pub fun main(): [AnyStruct] {
    let leagues: [AnyStruct] = []
    let leagueIds = LeagueFactory.getLeagueIds()
    
    for leagueId in leagueIds {
        if let league = LeagueFactory.getLeagueDetails(leagueId: leagueId) {
            leagues.append(league)
        }
    }
    
    return leagues
}
