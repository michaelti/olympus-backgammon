import React from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import { Player } from "../../util";
import Dice from "./Dice";

function BackgammonExtras({ boardState: { turn, winner, diceRolled, dice }, applyTurn, undoTurn }) {
    return (
        <ListGroup horizontal="lg">
            <ListGroupItem>
                {winner
                    ? `${Player.properties[winner].colorName} won!`
                    : `${Player.properties[turn].colorName}’s turn`}
            </ListGroupItem>
            <ListGroupItem>
                <Dice initialDice={diceRolled} remainingDice={dice} />
            </ListGroupItem>
            <ListGroupItem>
                <Button onClick={applyTurn} color="success">
                    Submit turn
                </Button>
            </ListGroupItem>
            <ListGroupItem>
                <Button onClick={undoTurn}>Undo</Button>
            </ListGroupItem>
        </ListGroup>
    );
}

export default BackgammonExtras;
