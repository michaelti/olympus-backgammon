import React, { useState } from "react";
import { socketEmit } from "../api";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    ListGroup,
    ListGroupItem,
} from "reactstrap";

function RoomSetup() {
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const sendVariant = () => {
        socketEmit("room/select-variant", selectedVariant, (acknowledgement) => {
            if (acknowledgement.ok) {
                setSelectedVariant(null);
                setIsModalOpen(false);
            }
        });
    };

    return (
        <Modal isOpen={isModalOpen} size="lg">
            <ModalHeader>Which game would you like to play?</ModalHeader>
            <ModalBody>
                <ListGroup horizontal>
                    <ListGroupItem
                        onClick={() => setSelectedVariant(1)}
                        active={selectedVariant === 1}
                        tag="button"
                        action
                        disabled>
                        Portes
                    </ListGroupItem>
                    <ListGroupItem
                        onClick={() => setSelectedVariant(2)}
                        active={selectedVariant === 2}
                        tag="button"
                        action>
                        Plakoto
                    </ListGroupItem>
                    <ListGroupItem
                        onClick={() => setSelectedVariant(3)}
                        active={selectedVariant === 3}
                        tag="button"
                        action
                        disabled>
                        Fevga
                    </ListGroupItem>
                </ListGroup>
            </ModalBody>
            <ModalFooter>
                <Button size="lg" color="primary" onClick={sendVariant} disabled={!selectedVariant}>
                    I’m ready!
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default RoomSetup;
