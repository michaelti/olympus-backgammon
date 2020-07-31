import React from "react";
import Checker from "./Checker";
import PipSVG from "./svg/pip.svg";

function Pip({ size, top, bot, posX, invertY, onClick, active, highlighted, moveable }) {
    let checkers = Array(size);

    if (checkers.length > 0) {
        checkers.fill(top);
        checkers[0] = bot;
    }

    const squishAmount =
        checkers.length > 6 ? ((checkers.length - 6) * 100) / (checkers.length - 1) : 0;

    return (
        <g onClick={onClick} style={moveable || highlighted ? { cursor: "pointer" } : {}}>
            {highlighted ? (
                <rect
                    width="100"
                    height="600"
                    x={posX}
                    y={invertY ? "-100%" : "0"}
                    transform={invertY ? "scale(1, -1)" : ""}
                    fill="rgb(128, 128, 128)"
                />
            ) : null}

            <image
                href={PipSVG}
                width="100"
                height="600"
                x={posX}
                y={invertY ? "-100%" : "0"}
                transform={invertY ? "scale(1, -1)" : ""}
            />

            {checkers.map((checker, i) => {
                const posY = i * (100 - squishAmount);
                return (
                    <Checker
                        key={i}
                        posX={posX}
                        posY={invertY ? 1100 - posY : posY}
                        color={checker}
                        active={active && i === size - 1}
                    />
                );
            })}
        </g>
    );
}

export default Pip;
