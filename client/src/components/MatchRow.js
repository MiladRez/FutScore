import { DateTime } from "luxon";
import "../styles/MatchRow.css";

const MatchRow = ({ match }) => {

    const matchStatus = () => {
        switch (match.fixture.status.short) {
            case "1H":
            case "2H":
            case "ET":
                return (
                    <div className="ui green circular label">
                        {match.fixture.status.elapsed}
                    </div>
                )
            case "HT":
            case "P":
            case "BT":
            case "LIVE":
                return (
                    <div className="ui green circular label">
                        {match.fixture.status.short}
                    </div>
                )
            case "NS":
                return null;
            default:
                return (
                    <div className="ui circular label">
                        {match.fixture.status.short}
                    </div>
                )                
        }
    }

    const matchScore = () => {
        let time = match.fixture.date;
        time = DateTime.fromISO(time).toLocaleString(DateTime.TIME_SIMPLE).toLowerCase();

        switch (match.fixture.status.short) {
            case "1H":
            case "HT":
            case "2H":
            case "ET":
            case "FT":
            case "AET":
            case "BT":
            case "INT":
            case "LIVE":
                return (
                    <div>
                        {match.goals.home} - {match.goals.away}
                    </div>
                )
            case "P":
            case "PEN":
                return (
                    <div className="matchScorePenalties">
                        <div>{match.goals.home} - {match.goals.away}</div>
                        <div className="pensShootoutScore">{"("} {match.score.penalty.home} - {match.score.penalty.away} {")"}</div>
                    </div>
                )
            case "TBD":
            case "NS":
                
                return (
                    <div>
                        {time}
                    </div>
                )
            case "SUSP":
            case "PST":
            case "CANC":
            case "ABD":
                return (
                    <div className="cancelledMatch">
                        {time}
                    </div>
                )
            case "AWD":
            case "WO":
                return "3 - 0";
            default:
                return "TBD"
        }
    }

    return (
        <tr className="matchRow" key={match.fixture.id}>
            <td className="matchStatus">
                    {matchStatus()}
            </td>
            <td className="homeTeam">
                <div className="homeTeamName">
                    {match.teams.home.name}
                </div>
            </td>
            <td className="teamLogo">
                <img className="teamLogoImg" alt="home team logo" src={match.teams.home.logo} />
            </td>
            <td className="matchScore">
                {matchScore()}
            </td>
            <td className="teamLogo">
                <img className="teamLogoImg" alt="away team logo" src={match.teams.away.logo} />
            </td>
            <td className="awayTeam">
                <div className="awayTeamName">
                    {match.teams.away.name}
                </div>
            </td>
        </tr>
    )
}

export default MatchRow;