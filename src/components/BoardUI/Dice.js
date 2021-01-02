import React from "react";
import styled from "styled-components";
import Die from "./Die";

const Container = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 5px 0;

    > *:not(:last-child) {
        margin-right: 5px;
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
