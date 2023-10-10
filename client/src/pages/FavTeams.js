import { useState } from "react";
import NavBar from "../components/NavBar";
import FavsGroupTable from "../components/FavsGroupTable";
import FollowNewTeam from "../components/FollowNewTeam.js";
import { Icon } from "semantic-ui-react";

const FavTeams = ({teams}) => {

	const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
	}

    return (
        <>
            <NavBar />
            <div className="ui container center">
                <h1 className="header"><Icon name="caret right" className="caretIcon"></Icon>My Teams</h1>
                <FavsGroupTable favsGroup={teams} tableType={"favTeams"} toggleModal={toggleModal} />
            </div>
            {showModal ?
                <FollowNewTeam toggleModal={toggleModal} showModal={showModal} favTeamsIds={teams.map(team => team.team_id)} />
                : null
            }
        </>   
    )
}

export default FavTeams;

        
            
            