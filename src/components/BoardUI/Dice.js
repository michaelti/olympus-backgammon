import React from "react";
import styled from "styled-components";
import Dice1 from "./svg/dice/dice-1.svg";
import Dice2 from "./svg/dice/dice-2.svg";
import Dice3 from "./svg/dice/dice-3.svg";
import Dice4 from "./svg/dice/dice-4.svg";
import Dice5 from "./svg/dice/dice-5.svg";
import Dice6 from "./svg/dice/dice-6.svg";

const Img = styled.img`
    height: 2em;
    opacity: ${({ used }) => (used ? "0.5" : "1")};

    &:not(:last-child) {
        margin-right: 0.5em;
    }
`;

function Dice({ initialDice, remainingDice }) {
    const diceSVGs = {
        1: Dice1,
        2: Dice2,
        3: Dice3,
        4: Dice4,
        5: Dice5,
        6: Dice6,
    };

    return (
        <div>
            {initialDice.map((die, i) => (
                <Img
                    src={diceSVGs[die]}
                    alt={die}
                    key={i}
                    used={
                        initialDice.length === 4
                            ? i < initialDice.length - remainingDice.length
                            : !remainingDice.includes(die)
                    }
                />
            ))}
        </div>
    );
}

export default Dice;
