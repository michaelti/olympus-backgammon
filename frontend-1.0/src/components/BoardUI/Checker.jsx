import React from "react";
import { Player } from "../../util.js";
import styled from "styled-components";

const Base = styled.div`
    width: 100%;
    padding-top: 100%;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    box-shadow: ${(props) => props.glow && "0 0 0 5px gray"};

    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        height: 60%;
        border-radius: 50%;
    }

    &::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 50%;
        border-radius: 50%;
    }
`;

const Black = styled(Base)`
    background: linear-gradient(-30deg, #000, #333);

    &::before {
        background: linear-gradient(150deg, #000, #333);
    }

    &::after {
        background: linear-gradient(-30deg, #000, #333);
    }
`;

const White = styled(Base)`
    background: linear-gradient(-30deg, #ddd, #fff);

    &::before {
        background: linear-gradient(150deg, #ddd, #fff);
    }

    &::after {
        background: linear-gradient(-30deg, #ddd, #fff);
    }
`;

function Checker({ color, glow }) {
    return color === Player.white ? <White glow={glow} /> : <Black glow={glow} />;
}

export default Checker;
