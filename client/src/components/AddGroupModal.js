import { Button, Dropdown, Modal } from "semantic-ui-react";
import "../styles/AddGroupModal.css";

const AddGroupModal = ({ dropdownOptions, toggleModal, showModal, groupsToBeAdded, addGroupsToDB, modalType }) => {

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
                    {modalType === "teams" ? "Select team to follow" : "Select league to follow"}
                </Modal.Header>
                <Modal.Content>
                    {dropdownOptions ?
						<Dropdown
                            placeholder={modalType === "teams" ? "Team" : "League"}
                            fluid
                            multiple
                            search
                            onChange={(e, value) => groupsToBeAdded(e, value)}
                            loading={dropdownOptions ? false : true}
                            disabled={dropdownOptions ? false : true}
                            selection
                            options={dropdownOptions}
                        >
                        </Dropdown>
                        : null
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={addGroupsToDB}>Add</Button>
                    <Button negative onClick={toggleModal}>Cancel</Button>
                </Modal.Actions>
            </Modal> 
        </div>
    )

}

export default AddGroupModal;