import { useState } from "react";
import "../styles/FavLeagues.css";
import NavBar from "../components/NavBar";
import FavsGroupTable from "../components/FavsGroupTable";
import FollowNewLeague from "../components/FollowNewLeague";
import { Icon } from "semantic-ui-react";

const FavLeagues = ({leagues}) => {

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <>
            <NavBar />
            <div className="ui container center">
                <h1 className="header"><Icon name="caret right" className="caretIcon"></Icon>My Leagues</h1>
                <FavsGroupTable favsGroup={leagues} tableType={"favLeagues"} toggleModal={toggleModal} />
            </div>
            {showModal ?
                <FollowNewLeague toggleModal={toggleModal} showModal={showModal} favLeaguesIds={leagues.map(league => league.id)} />
                : null
            }
        </>      
    )
}

export default FavLeagues;