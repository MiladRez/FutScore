import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

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
            {/* {data ?
                data.map(fixture => (
                    <div>
                        <div>{ fixture.id }</div>
                        <div>{ fixture.status }</div>
                        <div>{ fixture.stage }</div>
                        <div>{ fixture.utcDate }</div>
                        <div>{ fixture.lastUpdated }</div>
                    </div>
                )) : <div>Loading...</div>
            } */}
            <Dashboard data={data} />
        </div>
    )
}

export default App;