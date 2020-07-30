import React from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import { Player } from "../../util";
import Dice from "./Dice";

function BackgammonExtras({
    boardState: { turn, winner, diceRolled, dice },
    applyTurn,
    undoTurn,
    player,
    isTurn,
}) {
    return (
        <ListGroup horizontal="lg">
            <ListGroupItem>
                {player ? `Playing as ${Player.properties[player].colorName}` : "Spectating"}
            </ListGroupItem>
            <ListGroupItem>
                {winner !== null
                    ? `${Player.properties[winner].colorName} won!`
                    : turn !== null
                    ? `${Player.properties[turn].colorName}’s turn`
                    : null}
            </ListGroupItem>
            <ListGroupItem>
                <Dice initialDice={diceRolled} remainingDice={dice} />
            </ListGroupItem>
            <ListGroupItem>
                <Button onClick={applyTurn} color="success" className="mr-3" disabled={!isTurn}>
                    Finish turn
                </Button>
                <Button onClick={undoTurn} disabled={!isTurn}>
                    Undo
                </Button>
            </ListGroupItem>
        </ListGroup>
    );
}

export default BackgammonExtras;
