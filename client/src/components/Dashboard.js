import NavBar from "./NavBar";
import "../styles/Dashboard.css";
import { useEffect, useState } from "react";

const Dashboard = ({ data }) => {

    const [matches, setMatches] = useState([]);
    const [favTeams, setFavTeams] = useState([]);
    const [favLeagues, setFavLeagues] = useState([]);

    const [favTeamsMatches, setFavTeamsMatches] = useState([]);
    const [favLeaguesMatches, setFavLeaguesMatches] = useState([]);

    let noLiveMatches = true;

    // const [noLiveMatches, setNoLiveMatches] = useState(true);

    const getLeagueMatches = (league) => {
        return matches.map(match => {
            match.league.id = league.id
        })
    }

    useEffect(() => {
        if (data) {
            setMatches(data.data);
            setFavTeams(data.favTeams.map(team => team.team_name));
            setFavLeagues(data.favLeagues);
            
            setFavTeamsMatches(matches.map(match => (
                (favTeams.includes(match.teams.home.name) || favTeams.includes(match.teams.away.name)) ?
                    match : null
            )))
            setFavLeaguesMatches(favLeagues.map(league => (
                    league.name, getLeagueMatches(league)
            )))
        }
    }, [data, matches]);

    if (matches.length > 0) {
        console.log("Team name: ", matches[149].teams.home.name);
        console.log("Is favourite team: ", favTeams.includes(matches[149].teams.home.name));

        console.log(favTeamsMatches[0])
    }

    return (
        <div>
            <NavBar />

            {
                matches && matches.length > 0 ? 
                    <table className="ui fixed table main">
                        <thead>
                            <tr>
                                <th colSpan="4">Favourite Teams</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                matches.map(match => (
                                    (favTeams.includes(match.teams.home.name) || favTeams.includes(match.teams.away.name)) ?
                                        <tr key={ match.fixture.id }>
                                            <td><a className="ui green circular label">{ match.fixture.status.elapsed ? match.fixture.status.elapsed : 0 }</a></td>
                                            <td>{ match.teams.home.name }</td>
                                            <td>{ match.score.fulltime.home } : { match.score.fulltime.away }</td>
                                            <td>{ match.teams.away.name }</td>
                                        </tr>
                                    : null
                                ))
                            }
                        </tbody>
                    </table>
                : <h2 style={{ "marginTop": "150px" }}>There are currently no live matches</h2>
            }

            {
                matches && matches.length > 0 ?
                    favLeagues.map(league => (
                        <table className="ui fixed table">
                            <thead>
                                <tr>
                                    <th colSpan="4">{ league.name }</th>
                                </tr>
                            </thead>
                            <tbody>
                                {   
                                    matches.map(match => (
                                        match.league.name === league.name && match.league.id == league.id ?
                                            <tr key={ match.fixture.id }>
                                                <td><a className="ui green circular label">{match.fixture.status.elapsed ? match.fixture.status.elapsed : 0}</a></td>
                                                <td>{match.teams.home.name}</td>
                                                <td>{match.score.fulltime.home} : {match.score.fulltime.away}</td>
                                                <td>{match.teams.away.name}</td>
                                            </tr>
                                        : null
                                    ))
                                }
                                {
                                    noLiveMatches ?
                                        <tr>
                                            <td>No live matches</td>
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