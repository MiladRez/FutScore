import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
    return (
        <div className="ui green fixed inverted menu">
            <div className="ui container">
                <div className="header item"><i className="futbol icon small"></i><h2 className="appTitle">FutScore</h2></div>
                <Link to="/">Home</Link>
                <Link to="/myTeams">My Teams</Link>
                <Link to="/myLeagues">My Leagues</Link>
            </div>
        </div>
    )
}

export default NavBar;