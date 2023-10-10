import { useState } from "react";
import { Icon, Transition } from "semantic-ui-react";
import "../styles/FavsGroupTable.css";

const FavsGroupTable = ({ favsGroup, tableType, toggleModal }) => {

    const [removeButtonVisible, setRemoveButtonVisible] = useState(-1);

    const showX = (index) => {
        setRemoveButtonVisible(index)
    }

    const hideX = () => {
        setRemoveButtonVisible(-1)
	}
	
	const removeTeamFromDB = (selectedTeam) => {
        const team_id = selectedTeam.team_id
        fetch("http://localhost:8080/removeTeam/" + team_id);
		window.location.reload(false);
	}
	
	const removeLeagueFromDB = (selectedLeague) => {
		const league_id = selectedLeague.id
		fetch("http://localhost:8080/removeLeague/" + league_id);
		window.location.reload(false);
	}

    const favRow = (favGroup, index) => {
        if (tableType === "favTeams") {
            return (
                <>
                    <td>
                        <img className="teamLogo" alt="" src={favGroup.logo} />
                        {favGroup.name}
                    </td>
                    <td>
                        <Transition visible={removeButtonVisible === index} animation="scale" duration={{ hide: 100, show: 600 }}>
                            <Icon name="x" className="removeGroup" onClick={() => removeTeamFromDB(favGroup)} />
                        </Transition>
                    </td>
                </>
            )
        } else if (tableType === "favLeagues") {
			return (
				<>
					<td>
						<img className="leagueFlag" alt="" src={favGroup.flag} />
						{favGroup.country} - {favGroup.name}
					</td>
					<td>
						<Transition visible={removeButtonVisible === index} animation="scale" duration={{ hide: 100, show: 600 }}>
							<Icon name="x" className="removeGroup" onClick={() => removeLeagueFromDB(favGroup)} />
						</Transition>
					</td>
				</>
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
                    {favsGroup.map((favGroup, index) => (
                        <tr className="favGroupRow" key={tableType === "favTeams" ? favGroup.team_id : favGroup.id} onMouseEnter={() => showX(index)} onMouseLeave={hideX}>
                            {favRow(favGroup, index)}
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