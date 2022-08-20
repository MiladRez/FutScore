import MatchTableBody from "./MatchTableBody";
import "../styles/MatchTable.css";

const MatchTable = (props) => {

    return (
        <table className="ui fixed table tableWidth">
            <thead>
                <tr>
                    <th colSpan="1">
                        <center>
                            {props.tableHeader}
                        </center>
                    </th>
                </tr>
            </thead>
            <MatchTableBody tableType={props.tableType} matchesList={props.matchesList} />
        </table>
    )
}

export default MatchTable;