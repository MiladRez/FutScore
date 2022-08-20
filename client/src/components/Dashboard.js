import NavBar from "./NavBar";
import "../styles/Dashboard.css";
import { useCallback, useEffect, useState } from "react";
import MatchTable from "./MatchTable";

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

    const getTeamMatch = useCallback((team) => {
        for (let match of matches) {
            if (match.teams.home.id === team.id || match.teams.away.id === team.id) {
                return match;
            }  
        }
        return null;
    }, [matches])

    const getLeagueMatches = useCallback((league) => {
        return matches.flatMap(match => (
            (match.league.id === league.id) ? match : []
        ))
    }, [matches])

    const getAllOtherLeaguesMatches = useCallback(() => {
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
    }, [matches, favLeaguesIds])

    useEffect(() => {
        if (data) {
            setMatches(data.data);
            setFavTeams(data.favTeams);
            setFavLeagues(data.favLeagues);
            setFavLeaguesIds(data.favLeagues.map(league => league.id));
        }
    }, [data]);

    useEffect(() => {
        if (favTeams) {
            favTeams.map(team => (
                team.match = getTeamMatch(team)
            ))

            // Adds match for each team if they play that day in a new field (match) inside favTeams
            setFavTeamsMatches(Array.from(
                new Set(
                    favTeams.flatMap(team => (
                        team.match ? team.match : []
                    ))
                )
            ))
        }
    }, [favTeams, getTeamMatch])

    useEffect(() => {
        if (favLeagues) {
            // Adds matches for each league in a new field (matches) inside favLeagues
            favLeagues.map(league => (
                league.matches = getLeagueMatches(league)
            ));
        }
    }, [favLeagues, getLeagueMatches])

    useEffect(() => {
        // Adds matches of all other leagues
        setAllOtherLeagues(getAllOtherLeaguesMatches())
    }, [matches, getAllOtherLeaguesMatches])

    if (matches.length > 0) {
        // console.log("Team name: ", matches[149].teams.home.name);
        // console.log("Is favourite team: ", favTeams.includes(matches[149].teams.home.name));

        console.log(matches)
    }

    return (
        <div className="dashboardPage">
            <NavBar />

            {favTeams && favTeams.length > 0 ?
                <MatchTable tableHeader={"Favourite Teams"} tableType={"favTeams"} matchesList={[matches, favTeamsMatches]} />
                : null
            }

            {favLeagues && favLeagues.length > 0 ?
                favLeagues.map(league => (
                    <MatchTable key={league.id} tableHeader={`${league.country}-${league.name}`} tableType={"favLeagues"} matchesList={league} />
                ))
                : null
            }

            {allOtherLeagues && allOtherLeagues.length > 0 ?
                allOtherLeagues.map(league => (
                    <MatchTable key={league.id} tableHeader={`${league.country}-${league.name}`} tableType={"allOtherLeagues"} matchesList={league} />
                ))
                : null
            }
        </div>
    )
}

export default Dashboard;