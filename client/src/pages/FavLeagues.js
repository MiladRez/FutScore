import NavBar from "../components/NavBar";

const FavLeagues = ({leagues}) => {
    return (
        <div>
            <h1><center>My Leagues</center></h1>
                
            <NavBar />
            
            <form action="/add_league">
                <button class="ui basic button" id="add_button">
                    <i class="plus icon"></i>
                    Add League
                </button>
            </form>
            <center>
                <table class="ui selectable celled table" style={{ "width": "80%", "text-align": "center"}}>
                    <thead>
                        <tr>
                            <th>League</th>
                            <th>Table</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leagues.map(league => (
                            <tr style={{ "height": "50px"}}>
                                <td>{ league.name }</td>
                                <form action="/standings/leagues/{league.name}" method="get">
                                    <td><button name="table" class="ui icon button"><i class="table icon"></i></button></td>
                                </form>
                                <form action="/remove/leagues/{league.name}" method="get">
                                    <td><button name="removed" class="ui icon button" style={{ "color": "red"}} ><i class="times icon"></i></button></td>
                                </form>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </center>
        </div>      
    )
}

export default FavLeagues;
