import "../styles/FavsGroupTable.css";

const FavsGroupTable = ({ favsGroup, tableType, toggleModal }) => {

    const favRow = (favGroup) => {
        if (tableType === "favTeams") {
            return (
                <td>
                    <img className="teamLogo" alt="" src={favGroup.logo} />
                    {favGroup.name}
                </td>
            )
        } else if (tableType === "favLeagues") {
            return (
                <td>
                    <img className="leagueFlag" alt="" src={favGroup.flag} />
                    {favGroup.country} - {favGroup.name}
                </td>
            )
        } else {
            return null;
        }
    }

    return (
        <div className="tableDiv">
            <table className="ui selectable celled table">
                <thead>
                    <tr>
                        <th>Following</th>
                    </tr>
                </thead>
                <tbody>
                    {favsGroup.map(favGroup => (
                        <tr className="favGroupRow" key={tableType === "favTeams" ? favGroup.team_id : favGroup.id}>
                            {favRow(favGroup)}
                        </tr>
                    ))}
                    <tr className="addGroup">
                        <td>
                            {/* eslint-disable-next-line */}
                            <a href="#" onClick={() => toggleModal()}>
                                <i className="plus icon"></i>
                                {tableType === "favTeams" ? "Add Team" : "Add League"}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </div>
    )
}

export default FavsGroupTable;