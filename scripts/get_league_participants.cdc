import LeagueFactory from "../contracts/LeagueFactory.cdc"

// Get all participants in a league
pub fun main(leagueId: UInt64): [Address] {
    return LeagueFactory.getLeagueParticipants(leagueId: leagueId)
}
