import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

const App = () => {

    const [data, setData] = useState()

    useEffect(() => {
        fetch("http://localhost:8080/test")
            .then(response => response.json())
            .then(result => {
                console.log(result)
                setData(result)
            })
        console.log("Inside useEffect");
    }, []);

    console.log(data ? data[0].id : "does not exist")

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
            <Dashboard matches={data} />
        </div>
    )
}

export default App;