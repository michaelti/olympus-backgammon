import React from "react";
import CheckerW from "./svg/checker-w.svg";
import CheckerB from "./svg/checker-b.svg";
import { Player } from "../../util.js";
import styled from "styled-components";

const Img = styled.img`
    display: block;
    border-radius: 50%;
    width: 100%;

    box-shadow: ${(props) => props.glow && "0 0 0 5px gray"};
`;

function Checker({ color, glow }) {
    return (
        <Img
            src={color === Player.white ? CheckerW : CheckerB}
            alt={Player.properties[color].colorName + " checker"}
            glow={glow}
        />
    );
}

export default Checker;
