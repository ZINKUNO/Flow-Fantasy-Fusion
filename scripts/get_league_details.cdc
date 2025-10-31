import LeagueFactory from "../contracts/LeagueFactory.cdc"

// Get specific league details
pub fun main(leagueId: UInt64): AnyStruct? {
    return LeagueFactory.getLeagueDetails(leagueId: leagueId)
}
