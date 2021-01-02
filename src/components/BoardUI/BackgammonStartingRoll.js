import React from "react";
import Die from "./Die";
import { socketEmit } from "../../api";
import styled from "styled-components";
import Button from "./Button";

const Container = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 5px 0;
`;

function BackgammonStartingRoll({ player, color, startingRolls }) {
    const doStartingRoll = () => {
        socketEmit("room/starting-roll");
    };

    const die = startingRolls[color] || startingRolls.draw;

    return (
        <Container>
            {die ? <Die number={die} /> : null}
            {player === color && !startingRolls[color] ? (
                <Button onClick={doStartingRoll}>
                    {!startingRolls.draw ? "Roll to go first" : "Roll again"}
                </Button>
            ) : null}
        </Container>
    );
}

export default BackgammonStartingRoll;
