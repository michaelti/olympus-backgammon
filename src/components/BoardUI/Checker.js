import React from "react";
import { Player } from "../../util.js";
import CheckerW from "./svg/checker-w.svg";
import CheckerB from "./svg/checker-b.svg";

function Checker({ posX, posY, color, active }) {
    const translateX = posX + "px";
    const translateY = posY + "px";
    const transform = `translate( ${translateX}, ${translateY} )`;

    return (
        <g style={{ transform: transform, transition: "transform 0.15s ease" }}>
            {active ? <circle cx="50" cy="50" r="60" fill="rgb(128, 128, 128)" /> : null}
            <image href={color === Player.white ? CheckerW : CheckerB} width="100" height="100" />
        </g>
    );
}

export default Checker;
