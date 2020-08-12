import React, { useState } from "react";
import { socketEmit } from "../api";
import CopyInput from "./UI/CopyInput";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    ListGroup,
    ListGroupItem,
} from "reactstrap";
import { Variant } from "../util";

function RoomSetup({ show }) {
    const [selectedVariant, setSelectedVariant] = useState(null);

    const sendVariant = () => {
        socketEmit("room/select-variant", selectedVariant, (acknowledgement) => {
            if (acknowledgement.ok) {
                setSelectedVariant(null);
            }
        });
    };

    return (
        <Modal isOpen={show} size="lg">
            <ModalHeader>Start a new game</ModalHeader>
            <ModalBody>
                <h6 className="mb-3">Share this link with your friend</h6>
                <CopyInput value={window.location.href} />
                <hr />
                <h6 className="mb-3">Which game would you like to play?</h6>
                <ListGroup horizontal>
                    <ListGroupItem
                        onClick={() => setSelectedVariant(Variant.portes)}
                        active={selectedVariant === Variant.portes}
                        tag="button"
                        action>
                        {Variant.properties[Variant.portes].name}
                    </ListGroupItem>
                    <ListGroupItem
                        onClick={() => setSelectedVariant(Variant.plakoto)}
                        active={selectedVariant === Variant.plakoto}
                        tag="button"
                        action>
                        {Variant.properties[Variant.plakoto].name}
                    </ListGroupItem>
                    <ListGroupItem
                        onClick={() => setSelectedVariant(Variant.fevga)}
                        active={selectedVariant === Variant.fevga}
                        tag="button"
                        action>
                        {Variant.properties[Variant.fevga].name}
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
