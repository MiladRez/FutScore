import "../styles/NavBar.css";

const NavBar = () => {
    return (
        <div className="ui green fixed inverted menu">
            <div className="ui container">
                <div className="header item"><i className="futbol icon small"></i><h2 className="appTitle">FutScore</h2></div>
                <a href="/" className="item">Home</a>
                <a href="/fav_leagues" className="item">My Leagues</a>
                <a href="/fav_teams" className="item">My Teams</a>
            </div>
        </div>
    )
}

export default NavBar;