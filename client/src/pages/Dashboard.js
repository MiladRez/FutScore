import NavBar from "../components/NavBar";
import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import MatchTable from "../components/MatchTable";

const Dashboard = ({ data }) => {

    const [matches, setMatches] = useState([]); // list of all matches scheduled today fetched from API
    const [favTeams, setFavTeams] = useState([]); // list of user favourited teams
    const [favLeagues, setFavLeagues] = useState([]); // list of user favourited leagues
    const [allOtherLeagues, setAllOtherLeagues] = useState([]); // list of all other leagues that have matches scheduled today (not favourited by user)
    const [favTeamsMatches, setFavTeamsMatches] = useState([]); // list of all user favourited teams' matches scheduled today

    useEffect(() => {
        if (data) {
            setMatches(data.data);
            setFavTeams(data.favTeams);
            setFavLeagues(data.favLeagues);
            setFavTeamsMatches(data.favTeamsMatches);
            setAllOtherLeagues(data.allOtherLeagues);
        }
    }, [data]);

    if (matches.length > 0) {
        // console.log("Team name: ", matches[149].teams.home.name);
        // console.log("Is favourite team: ", favTeams.includes(matches[149].teams.home.name));

        console.log(matches)
    }

    return (
        <div className="dashboardPage">
            <NavBar />
            <div className="ui container center">
                {favTeams && favTeams.length > 0 ?
                    <MatchTable tableType={"favTeams"} matchesList={[matches, favTeamsMatches]} />
                    : null
                }

                {favLeagues && favLeagues.length > 0 ?
                    favLeagues.map(league => (
                        <MatchTable key={league.id} tableType={"favLeagues"} matchesList={league} />
                    ))
                    : null
                }

                {allOtherLeagues && allOtherLeagues.length > 0 ?
                    allOtherLeagues.map(league => (
                        <MatchTable key={league.id} tableType={"allOtherLeagues"} matchesList={league} />
                    ))
                    : null
                }
            </div>
            
        </div>
    )
}

export default Dashboard;