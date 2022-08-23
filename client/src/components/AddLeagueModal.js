import "../styles/AddLeagueModal.css";
import { Button, Dropdown, Modal } from "semantic-ui-react";
import { useCallback, useEffect, useState } from "react";

const AddLeagueModal = ({ toggleModal, showModal, favLeaguesIds }) => {
    
    const [leagues, setLeagues] = useState([]);
    const [leaguesToBeAdded, setLeaguesToBeAdded] = useState([])

    const getLeaguesToBeAdded = (event, {value}) => {
        setLeaguesToBeAdded(value)
    }

    const formatAsDropdownItem = useCallback((leagues) => {
        return leagues.flatMap(league => (
            !favLeaguesIds.includes(league.league.id) ?
                {
                    key: league.league.id,
                    image: league.country.flag ? { src: league.country.flag } : null,
                    text: `${league.country.name} - ${league.league.name}`,
                    value: `${league.league.id}%${league.league.name}%${league.country.name}%${league.country.flag}%${league.league.logo}`,
                    // value: {id: league.league.id, name: league.league.name, country: league.country.name, flag: league.country.flag, logo: league.league.logo},
                    className: "cell"
                }
                : []
        ))
    }, [favLeaguesIds]);

    const addNewFavouriteLeaguesToDB = () => {
        const newLeaguesToAdd = leaguesToBeAdded.map(league => (
            {
                id: league.split("%")[0],
                name: league.split("%")[1],
                country: league.split("%")[2],
                flag: league.split("%")[3],
                logo: league.split("%")[4]
            }
        ))

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newLeaguesToAdd)
        };
        fetch("http://localhost:8080/addLeague", requestOptions);
        setLeaguesToBeAdded([]);
        toggleModal();
    }

    useEffect(() => {
        fetch("http://localhost:8080/getAllLeagues")
            .then(response => response.json())
            .then(result => {
                setLeagues(formatAsDropdownItem(result));
            })
    }, [formatAsDropdownItem])

    return (
        <div>
            <Modal
                onOpen={toggleModal}
                onClose={toggleModal}
                open={showModal}
                dimmer="blurring"
                size="small"
            >
                <Modal.Header>
                    Select league to follow
                </Modal.Header>
                <Modal.Content>
                    {leagues ?
                        <Dropdown
                            placeholder="League"
                            fluid
                            multiple
                            search
                            onChange={getLeaguesToBeAdded}
                            loading={leagues ? false : true}
                            disabled={leagues ? false : true}
                            selection
                            options={leagues}
                        >
                        </Dropdown>
                        : null
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={addNewFavouriteLeaguesToDB}>Add</Button>
                    <Button negative onClick={() => toggleModal()}>Cancel</Button>
                </Modal.Actions>
            </Modal> 
        </div>
        
    )
}

export default AddLeagueModal;