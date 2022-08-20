import MatchRow from "./MatchRow";
import "../styles/MatchTableBody.css";

const MatchTableBody = (props) => {

    const noLiveMatchesRow = () => {
        return (
            <tr>
                <td className="noLiveMatches">
                    No live matches
                </td>
            </tr>
        )
    }

    switch (props.tableType) {
        case "favTeams":

            const matches = props.matchesList[0];
            const favTeamsMatches = props.matchesList[1];
            
            return (
                <tbody>
                    {matches && matches.length > 0 ?
                        favTeamsMatches.map(match => (
                            <MatchRow match={match} key={match.fixture.id} />
                        ))
                        : noLiveMatchesRow()
                    }
                </tbody>
            )
        case "favLeagues":

            const favLeague = props.matchesList;
            
            return (
                <tbody>
                    {favLeague.matches && favLeague.matches.length > 0 ?
                        favLeague.matches.map(match => (
                            <MatchRow match={match} key={match.fixture.id} />
                        ))
                        : noLiveMatchesRow()
                    }
                </tbody>
                
            )
        case "allOtherLeagues":

            const league = props.matchesList;
            
            return (
                <tbody>
                    {league.matches && league.matches.map(match => (
                        <MatchRow match={match} key={match.fixture.id} />
                    ))}
                </tbody>
            )
        default:
            return null;
    }
}

export default MatchTableBody;