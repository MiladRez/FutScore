import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
    return (
        <div className="ui green fixed inverted menu">
            <div className="ui container center">
                <Link to="/" className="header item"><i className="futbol icon small"></i><h2 className="appTitle">FutScore</h2></Link>
                <Link to="/myTeams" className="item">My Teams</Link>
                <Link to="/myLeagues" className="item">My Leagues</Link>
            </div>
        </div>
    )
}

export default NavBar;