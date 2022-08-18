import NavBar from "./NavBar";
import "../styles/Dashboard.css";
import { useEffect, useState } from "react";

const Dashboard = ({ data }) => {

    // list of all matches scheduled today fetched from API
    const [matches, setMatches] = useState([]);
    // list of user favourited teams
    const [favTeams, setFavTeams] = useState([]);
    // list of user favourited leagues
    const [favLeagues, setFavLeagues] = useState([]);
    // list of favourited leagues' ids
    const [favLeaguesIds, setFavLeaguesIds] = useState([]);
    // list of all other leagues that have matches scheduled today (not favourited by user)
    const [allOtherLeagues, setAllOtherLeagues] = useState([]);
    // list of all user favourited teams' matches scheduled today
    const [favTeamsMatches, setFavTeamsMatches] = useState([]);

    const getTeamMatch = (team) => {
        for (let match of matches) {
            if (match.teams.home.id === team.id || match.teams.away.id === team.id) {
                return match;
            }  
        }
        return null;
    }

    const getLeagueMatches = (league) => {
        return matches.flatMap(match => (
            (match.league.id === league.id) ? match : []
        ))
    }

    const getAllOtherLeaguesMatches = () => {
        const map = new Map();

        for (let match of matches) {
            if (!favLeaguesIds.includes(match.league.id)) {
                if (map.has(match.league.id)) {
                    map.set(
                        match.league.id, {
                            ...map.get(match.league.id),
                            matches: [...map.get(match.league.id).matches, match]
                        }
                    )
                } else {
                    map.set(
                        match.league.id, {
                            id: match.league.id,
                            name: match.league.name,
                            country: match.league.country,
                            flag: match.league.flag,
                            matches: [match]
                        }
                    );
                }
            }
        }
        return [...map.values()];
    }

    useEffect(() => {
        if (data) {
            setMatches(data.data);
            setFavTeams(data.favTeams);
            setFavLeagues(data.favLeagues);
            setFavLeaguesIds(data.favLeagues.map(league => league.id));

            favTeams.map(team => (
                team.match = getTeamMatch(team)
            ))

            // Adds matches for each league in a new field (matches) inside favLeagues
            favLeagues.map(league => (
                league.matches = getLeagueMatches(league)
            ));
            
            // Adds match for each team if they play that day in a new field (match) inside favTeams
            setFavTeamsMatches(Array.from(
                new Set(
                    favTeams.flatMap(team => (
                        team.match ? team.match : []
                    ))
                )
            ))
            
            // Adds matches of all other leagues
            setAllOtherLeagues(getAllOtherLeaguesMatches())

        }
    }, [data, matches]);

    if (matches.length > 0) {
        console.log("Team name: ", matches[149].teams.home.name);
        console.log("Is favourite team: ", favTeams.includes(matches[149].teams.home.name));

        console.log(allOtherLeagues)
    }

    return (
        <div className="dashboardPage">
            <NavBar />

            {favTeams && favTeams.length > 0 ?
                <table className="ui fixed table main tableWidth">
                    <thead>
                        <tr><th colSpan="1"><center>Favourite Teams</center></th></tr>
                    </thead>
                    <tbody>
                        {matches && matches.length > 0 ?
                            favTeamsMatches.map(match => (
                                <tr className="matchRow" key={match.fixture.id}>
                                    <td><center><div className="ui green circular label">{match.fixture.status.elapsed ? match.fixture.status.elapsed : 0}</div></center></td>
                                    <td className="homeTeam"><div className="matchDisplay">{match.teams.home.name}</div></td>
                                    <td className="teamLogo"><img className="teamLogoImg" alt="home team logo" src={match.teams.home.logo} /></td>
                                    <td className="matchScore">{match.score.fulltime.home} - {match.score.fulltime.away}</td>
                                    <td className="teamLogo"><img className="teamLogoImg" alt="away team logo" src={match.teams.away.logo} /></td>
                                    <td className="awayTeam"><div className="matchDisplay">{match.teams.away.name}</div></td>
                                </tr>
                            ))
                            : <tr><td className="noLiveMatches">No live matches</td></tr>
                        }
                    </tbody>
                </table>
                : null
            }

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
                : null
            }

            {allOtherLeagues && allOtherLeagues.length > 0 ?
                allOtherLeagues.map(league => (
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
                                    <td className="matchScore">{match.score.fulltime.home} - {match.score.fulltime.away}</td>
                                    <td className="teamLogo"><img className="teamLogoImg" alt="away team logo" src={match.teams.away.logo} /></td>
                                    <td className="awayTeam"><div className="matchDisplay">{ match.teams.away.name }</div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>   
                ))
                : null
            }
        </div>
    )
}

export default Dashboard;