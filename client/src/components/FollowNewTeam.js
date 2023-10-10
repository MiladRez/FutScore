import { useCallback, useEffect, useState } from "react";
import AddGroupModal from "./AddGroupModal";

const FollowNewTeam = ({ toggleModal, showModal, favTeamsIds }) => {
    
    const [teams, setTeams] = useState([]);
    const [teamsToBeAdded, setTeamsToBeAdded] = useState([]);

    const getTeamsToBeAdded = (_, {value}) => {
        setTeamsToBeAdded(value);
    }

    const formatAsDropdownItem = useCallback((teams) => {
        return teams.flatMap(team => (
            !favTeamsIds.includes(team.team.id) ?
                {
                    key: team.team.id,
                    image: team.team.logo ? { src: team.team.logo, className: "teamLogo" } : null,
                    text: team.team.name,
                    value: `${team.team.id}%${team.team.name}%${team.team.country}%${team.team.logo}`,
                    className: "cell"
                }
                : []
        ))
    }, [favTeamsIds]);

    const addNewTeamsToDB = () => {
        const newTeamsToAdd = teamsToBeAdded.map(team => (
            {
                id: team.split("%")[0],
                name: team.split("%")[1],
                country: team.split("%")[2],
                logo: team.split("%")[3]
            }
        ))

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTeamsToAdd)
        };
        fetch("http://localhost:8080/addTeam", requestOptions);
        setTeamsToBeAdded([]);
		toggleModal();
		window.location.reload(false);
    }

    useEffect(() => {
        fetch("http://localhost:8080/getAllTeams")
            .then(response => response.json())
            .then(result => {
                setTeams(formatAsDropdownItem(result));
            })
    }, [formatAsDropdownItem])

    return (
        <AddGroupModal dropdownOptions={teams} toggleModal={toggleModal} showModal={showModal} groupsToBeAdded={getTeamsToBeAdded} addGroupsToDB={addNewTeamsToDB} modalType={"teams"} />
    )

}

export default FollowNewTeam;