import NavBar from "./NavBar";
import "../styles/Dashboard.css";
import { useEffect, useState } from "react";

const Dashboard = ({ data }) => {

    const [matches, setMatches] = useState([]);
    const [favTeams, setFavTeams] = useState([]);
    const [favLeagues, setFavLeagues] = useState([]);

    const [favTeamsMatches, setFavTeamsMatches] = useState([]);

    const getLeagueMatches = (league) => {
        return matches.flatMap(match => (
            (match.league.id === league.id) ? match : []
        ))
    }

    useEffect(() => {
        if (data) {
            setMatches(data.data);
            setFavTeams(data.favTeams.map(team => team.team_name));
            setFavLeagues(data.favLeagues);
            
            setFavTeamsMatches(matches.flatMap(match => (
                (favTeams.includes(match.teams.home.name) || favTeams.includes(match.teams.away.name)) ?
                    match : []
            )))

            favLeagues.map(league => (
                league.matches = getLeagueMatches(league)
            ))
        }
    }, [data, matches]);

    if (matches.length > 0) {
        console.log("Team name: ", matches[149].teams.home.name);
        console.log("Is favourite team: ", favTeams.includes(matches[149].teams.home.name));

        console.log(favLeagues)
    }

    return (
        <div className="dashboardPage">
            <NavBar />

            <table className="ui fixed table main tableWidth">
                <thead>
                    <tr><th colSpan="1"><center>Favourite Teams</center></th></tr>
                </thead>
                <tbody>
                    {favTeamsMatches && favTeamsMatches.length > 0 ?
                        favTeamsMatches.map(match => (
                            <tr className="matchRow" key={match.fixture.id}>
                                <td><center><div className="ui green circular label">{match.fixture.status.elapsed ? match.fixture.status.elapsed : 0}</div></center></td>
                                <td className="homeTeam"><div className="matchDisplay">{match.teams.home.name}</div></td>
                                <td className="teamLogo"><img className="teamLogoImg" alt="home team logo" src={match.teams.home.logo} /></td>
                                {/* <center><td className="matchScore">
                                    <center><div className="matchDisplay">{match.score.fulltime.home} - {match.score.fulltime.away}</div></center>
                                    <div className="ui green circular label">{match.fixture.status.elapsed ? match.fixture.status.elapsed : 0}</div>
                                </td></center> */}
                                <td className="matchScore">{match.score.fulltime.home} - {match.score.fulltime.away}</td>
                                <td className="teamLogo"><img className="teamLogoImg" alt="away team logo" src={match.teams.away.logo} /></td>
                                <td className="awayTeam"><div className="matchDisplay">{ match.teams.away.name }</div></td>
                            </tr>
                        ))
                        : <tr><td className="noLiveMatches">No live matches</td></tr>
                    }
                </tbody>
            </table>

            {favLeagues && favLeagues.length > 0 ?
                favLeagues.map(league => (
                    <table className="ui fixed table tableWidth" key={ league.id }>
                        <thead>
                            <tr>
                                <th colSpan="1"><center>{ league.country } - { league.name }</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            {league.matches && league.matches.map(match => (
                                <tr className="matchRow" key={match.fixture.id}>
                                    <td><center><div className="ui green circular label">{match.fixture.status.elapsed ? match.fixture.status.elapsed : 0}</div></center></td>
                                    <td className="homeTeam"><div className="matchDisplay">{match.teams.home.name}</div></td>
                                    <td className="teamLogo"><img className="teamLogoImg" alt="home team logo" src={match.teams.home.logo} /></td>
                                    {/* <center><td className="matchScore">
                                        <center><div className="matchDisplay">{match.score.fulltime.home} - {match.score.fulltime.away}</div></center>
                                        <div className="ui green circular label">{match.fixture.status.elapsed ? match.fixture.status.elapsed : 0}</div>
                                    </td></center> */}
                                    <td className="matchScore">{match.score.fulltime.home} - {match.score.fulltime.away}</td>
                                    <td className="teamLogo"><img className="teamLogoImg" alt="away team logo" src={match.teams.away.logo} /></td>
                                    <td className="awayTeam"><div className="matchDisplay">{ match.teams.away.name }</div></td>
                                </tr>
                            ))}
                            {league.matches && league.matches.length < 1 ?
                                <tr>
                                    <td className="noLiveMatches">No live matches</td>
                                </tr>
                                : null
                            }
                        </tbody>
                    </table>   
                ))
                : <h2 style={{ "marginTop": "150px" }}>There are currently no live matches</h2>
            }
        </div>
    )
}

export default Dashboard;