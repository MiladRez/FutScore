import { useState } from "react";
import AddLeagueModal from "../components/AddLeagueModal";
import FavLeaguesTable from "../components/FavLeaguesTable";
import NavBar from "../components/NavBar";
import "../styles/FavLeagues.css";

const FavLeagues = ({leagues}) => {

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <div>
            <NavBar />
            <div className="ui container center">
                <h1 className="header">My Leagues</h1>
            
                <form action="/add_league">
                    <button className="ui basic button" id="add_button">
                        <i className="plus icon"></i>
                        Add League
                    </button>
                </form>
                <FavLeaguesTable leagues={leagues} toggleModal={toggleModal} />
            </div>
            {showModal ?
                <AddLeagueModal toggleModal={toggleModal} showModal={showModal} favLeaguesIds={leagues.map(league => league.id)} />
                : null
            }
        </div>      
    )
}

export default FavLeagues;