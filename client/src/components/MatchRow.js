import "../styles/MatchRow.css";

const MatchRow = ({ match }) => {

    const matchStatus = () => {
        switch (match.fixture.status.short) {
            case "1H":
            case "2H":
                return (
                    <td>
                        <center>
                            <div className="ui green circular label">
                                {match.fixture.status.elapsed}
                            </div>
                        </center>
                    </td>
                )
            default:
                return (
                    <td>
                        <center>
                            <div className="ui circular label">
                                {match.fixture.status.short}
                            </div>
                        </center>
                    </td>
                )                
        }
    }

    return (
        <tr className="matchRow" key={match.fixture.id}>
            {matchStatus()}
            <td className="homeTeam">
                <div className="teamName">
                    {match.teams.home.name}
                </div>
            </td>
            <td className="teamLogo">
                <img className="teamLogoImg" alt="home team logo" src={match.teams.home.logo} />
            </td>
            <td className="matchScore">
                {match.score.fulltime.home} - {match.score.fulltime.away}
            </td>
            <td className="teamLogo">
                <img className="teamLogoImg" alt="away team logo" src={match.teams.away.logo} />
            </td>
            <td className="awayTeam">
                <div className="teamName">
                    {match.teams.away.name}
                </div>
            </td>
        </tr>
    )
}

export default MatchRow;