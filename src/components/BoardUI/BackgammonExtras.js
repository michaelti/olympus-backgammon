import React from 'react';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';

function BackgammonExtras({ boardState, applyTurn, undoTurn }) {
    return (
        <ListGroup horizontal="lg">
            <ListGroupItem>
                Turn: { boardState.turn }
            </ListGroupItem>
            <ListGroupItem>
                Dice: { JSON.stringify(boardState.dice) }
            </ListGroupItem>
            <ListGroupItem>
                <Button onClick={applyTurn} color="success">
                    Submit turn
                </Button>
            </ListGroupItem>
            <ListGroupItem>
                <Button onClick={undoTurn}>
                    Undo
                </Button>
            </ListGroupItem>
        </ListGroup>
    );
}

export default BackgammonExtras;
