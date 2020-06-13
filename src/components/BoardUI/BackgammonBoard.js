import React, { useState } from "react";
import Pip from "./Pip";
import Off from "./Off";
import Bar from "./Bar";
import BackgroundSVG from "./svg/background.svg";
import { Player } from "../../util.js";

function BackgammonBoard({ boardState, doSubmove }) {
    const [moving, setMoving] = useState(false);
    const [sourcePip, setSourcePip] = useState(undefined);

    const handleClickPip = (clickedPip) => {
        const clickedPipObj = boardState.pips[clickedPip];

        if (!moving) {
            if (clickedPipObj.size > 0) {
                // Start a move
                setMoving(true);
                setSourcePip(clickedPip);
            }
        } else if (sourcePip !== clickedPip) {
            // Complete the started move
            doSubmove(sourcePip, clickedPip);
            setSourcePip(undefined);
            setMoving(false);
        }
    };

    return (
        <svg viewBox="0 0 1500 1200" style={{ width: "100%" }}>
            <image href={BackgroundSVG} width="1500" height="1200" />

            <Off posX={1400} invertY count={boardState.offWhite} color={Player.white} />
            <Off posX={0} invertY disabled />
            <Off posX={0} disabled />
            <Off posX={1400} count={boardState.offBlack} color={Player.black} />

            <Bar posX={700} invertY count={boardState.barWhite} color={Player.white} />
            <Bar posX={700} count={boardState.barBlack} color={Player.black} />

            {boardState.pips.map((pip, i) => {
                if (i === 0) return null;

                const pipQuadrant = Math.ceil((i / 24) * 4);
                let [posX, invertY] = [0, false];

                switch (pipQuadrant) {
                    case 1:
                        posX = 1400 - i * 100;
                        invertY = true;
                        break;
                    case 2:
                        posX = 700 - (i - 6) * 100;
                        invertY = true;
                        break;
                    case 3:
                        posX = (i - 12) * 100;
                        break;
                    case 4:
                        posX = (i - 18) * 100 + 700;
                        break;
                    default:
                        break;
                }

                return (
                    <Pip
                        key={i}
                        posX={posX}
                        invertY={invertY}
                        size={pip.size}
                        top={pip.top}
                        bot={pip.bot}
                        onClick={() => handleClickPip(i)}
                        active={i === sourcePip}
                    />
                );
            })}
        </svg>
    );
}

export default BackgammonBoard;
