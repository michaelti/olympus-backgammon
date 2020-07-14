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
`;

function Die({ number, used, className }) {
    const diceSVGs = {
        1: Dice1,
        2: Dice2,
        3: Dice3,
        4: Dice4,
        5: Dice5,
        6: Dice6,
    };

    return <Img className={className} src={diceSVGs[number]} alt={number} used={used} />;
}

export default Die;
