import React from "react";
import Checker from "./Checker";
import BarSVG from "./svg/bar.svg";

function Bar({ count, color, posX, invertY, onClick, active, moveable }) {
    const checkers = Array(count).fill(color);

    const squishAmount =
        checkers.length > 6 ? ((checkers.length - 6) * 100) / (checkers.length - 1) : 0;

    return (
        <g onClick={onClick} style={moveable ? { cursor: "pointer" } : {}}>
            <image href={BarSVG} width="100" height="600" x={posX} y={invertY ? "50%" : "0"} />

            {checkers.map((checker, i) => {
                const posY = 500 - i * (100 - squishAmount);
                return (
                    <Checker
                        key={i}
                        posX={posX}
                        posY={invertY ? 1100 - posY : posY}
                        color={checker}
                        active={active && i === count - 1}
                    />
                );
            })}
        </g>
    );
}

export default Bar;
