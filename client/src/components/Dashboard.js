import NavBar from "./NavBar";
import "../styles/Dashboard.css";

const Dashboard = ({ matches }) => {
    console.log("From Dashboard: ", matches);
    return (
        <div>
            <NavBar />

            {matches && matches.length > 0 ? 
                <table className="ui fixed table main">
                    <thead>
                        <tr>
                            <th colSpan="4">Favourite Teams</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map(fixture => (
                            <tr key={fixture.id}>
                                <td><a className="ui green circular label">{ fixture.status }</a></td>
                                <td>{ fixture.homeTeam.name }</td>
                                <td>{fixture.score.fullTime.homeTeam} : { fixture.score.fullTime.awayTeam }</td>
                                <td>{ fixture.awayTeam.name }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                : <h2 style={{ "marginTop": "150px" }}>There are currently no live matches</h2>
            }
                
            {/* <% leagues.forEach(function(league) { %>
                <table className="ui fixed table">
                    <thead>
                        <tr>
                            <th colSpan="4"><center><%= league.league_name %></center></th>
                        </tr>
                    </thead>
                    <tbody>
                        <% body["data"]["match"].forEach(function(fixture) { %>
                            <% if (fixture.league_name == league.league_name) { %>
                                <tr>
                                    <td id="time"><a className="ui green circular label"><%= fixture.time %></a></td>
                                    <td><%= fixture.home_name %></td>
                                    <td><%= fixture.score %></td>
                                    <td><%= fixture.away_name %></td>
                                </tr>
                            <% } %>
                        <% }); %>
                    </tbody>
                </table>
            <% }); %> */}
        </div>
    )
}

export default Dashboard;