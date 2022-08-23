import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "../pages/Dashboard";
import "../styles/App.css";
import FavLeagues from "../pages/FavLeagues";

const App = () => {

    const [data, setData] = useState();

    useEffect(() => {
        fetch("http://localhost:8080/getFixtures")
            .then(response => response.json())
            .then(result => {
                setData(result);
            });
    }, []);

    return (
        <div>
            { data ? 
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Dashboard data={data} />} />
                        <Route path="myTeams" />
                        <Route path="myLeagues" element={<FavLeagues leagues={data.favLeagues} />} />
                        <Route path="*" />
                    </Routes>
                </BrowserRouter>
                : null
            } 
        </div>

    )
}

export default App;