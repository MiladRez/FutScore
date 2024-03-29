import MatchTableBody from "./MatchTableBody";
import "../styles/MatchTable.css";

const MatchTable = (props) => {

    const tableHeader = () => {
        if (props.tableType === "favTeams") {
            return "Favourites";
        }
        return (
            <div className="tableHeader">
                <img className="leagueFlag" alt="" src={props.matchesList.flag} />
                {props.matchesList.country} - {props.matchesList.name}
            </div>
        )
    }

    return (
        <table className="ui fixed table tableWidth">
            <thead>
                <tr>
                    <th colSpan="1">
                        <center>
                            {tableHeader()}
                        </center>
                    </th>
                </tr>
            </thead>
            <MatchTableBody tableType={props.tableType} matchesList={props.matchesList} />
        </table>
    )
}

export default MatchTable;