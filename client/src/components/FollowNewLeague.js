import { useCallback, useEffect, useState } from "react";
import AddGroupModal from "./AddGroupModal";
import worldLogo from "../images/world-47.png";

const FollowNewLeague = ({ toggleModal, showModal, favLeaguesIds }) => {
    
    const [leagues, setLeagues] = useState([]);
    const [leaguesToBeAdded, setLeaguesToBeAdded] = useState([]);

    const getLeaguesToBeAdded = (_, {value}) => {
        setLeaguesToBeAdded(value)
    }

    const formatAsDropdownItem = useCallback((leagues) => {
        return leagues.flatMap(league => (
            !favLeaguesIds.includes(league.league.id) ?
                {
                    key: league.league.id,
                    image: league.country.flag ? { src: league.country.flag, className: "country" } : { className: "world", src:  worldLogo},
                    text: `${league.country.name} - ${league.league.name}`,
                    value: `${league.league.id}%${league.league.name}%${league.country.name}%${league.country.flag}%${league.league.logo}`,
                    // code below works but prints error warnings in console
                    // value: {id: league.league.id, name: league.league.name, country: league.country.name, flag: league.country.flag, logo: league.league.logo},
                    className: "cell"
                }
            : []
        ))
    }, [favLeaguesIds]);

	const addNewLeaguesToDB = async () => {
        const newLeaguesToAdd = leaguesToBeAdded.map(league => (
            {
                id: league.split("%")[0],
                name: league.split("%")[1],
                country: league.split("%")[2],
                flag: league.split("%")[3] !== "null" ? league.split("%")[3] : worldLogo,
                logo: league.split("%")[4]
            }
        ))

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newLeaguesToAdd)
		};
		console.log(requestOptions.body)
        await fetch("https://futscore-5xpn.onrender.com/addLeague", requestOptions);
        // console.log(newLeaguesToAdd)
        setLeaguesToBeAdded([]);
		toggleModal();
		window.location.reload(false);
    }

    useEffect(() => {
        fetch("https://futscore-5xpn.onrender.com/getAllLeagues")
            .then(response => response.json())
            .then(result => {
                setLeagues(formatAsDropdownItem(result));
            })
    }, [formatAsDropdownItem])

    return (
        <AddGroupModal dropdownOptions={leagues} toggleModal={toggleModal} showModal={showModal} groupsToBeAdded={getLeaguesToBeAdded} addGroupsToDB={addNewLeaguesToDB} modalType={"leagues"} />
    )
}

export default FollowNewLeague;