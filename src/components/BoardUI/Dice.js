import React from "react";
import styled from "styled-components";
import Die from "./Die";

const Container = styled.div`
    display: flex;
    margin-left: -0.25em;
    margin-right: -0.25em;

    > * {
        margin-left: 0.25em;
        margin-right: 0.25em;
    }
`;

function Dice({ initialDice, remainingDice }) {
    return (
        <Container>
            {initialDice.map((die, i) => (
                <Die
                    number={die}
                    key={i}
                    used={
                        initialDice.length === 4
                            ? i < initialDice.length - remainingDice.length
                            : !remainingDice.includes(die)
                    }
                />
            ))}
        </Container>
    );
}

export default Dice;
