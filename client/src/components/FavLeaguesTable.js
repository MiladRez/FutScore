import "../styles/FavLeaguesTable.css";

const FavLeaguesTable = ({ leagues, toggleModal }) => {

    return (
        <div className="tableDiv">
           <table className="ui selectable celled table">
                <thead>
                    <tr>
                        <th>Following</th>
                    </tr>
                </thead>
                <tbody>
                    {leagues.map(league => (
                        <tr className="favLeagueRow" key={league.id}>
                            <td>
                                <img className="leagueFlag" alt="" src={league.flag} />
                                {league.country} - {league.name}
                            </td>
                        </tr>
                    ))}
                    <tr className="addLeague">
                        <td>
                            {/* eslint-disable-next-line */}
                            <a href="#" onClick={() => toggleModal()}>
                                <i className="plus icon"></i>
                                Add League
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </div>
    )
}

export default FavLeaguesTable;