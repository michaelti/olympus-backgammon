import React, { useState } from "react";
import Pip from "./Pip";
import Off from "./Off";
import Bar from "./Bar";
import BackgroundSVG from "./svg/background.svg";
import { Player } from "../../util.js";

function BackgammonBoard({ boardState: { pips, offWhite, offBlack, barWhite, barBlack }, doMove }) {
    const [moving, setMoving] = useState(false);
    const [sourcePip, setSourcePip] = useState(undefined);

    const handleClickPip = (clickedPip) => {
        const clickedPipObj = pips[clickedPip];

        if (!moving) {
            if (clickedPipObj.size > 0) {
                // Start a move
                setMoving(true);
                setSourcePip(clickedPip);
            }
        } else if (sourcePip !== clickedPip) {
            // Complete the started move
            doMove(sourcePip, clickedPip);
            setSourcePip(undefined);
            setMoving(false);
        }
    };

    const handleClickOff = (clickedOff) => {
        if (moving) {
            if (clickedOff === Player.white) doMove(sourcePip, 25);
            if (clickedOff === Player.black) doMove(sourcePip, 0);
            setSourcePip(undefined);
            setMoving(false);
        }
    };

    return (
        <svg viewBox="0 0 1500 1200" style={{ width: "100%" }}>
            <image href={BackgroundSVG} width="1500" height="1200" />

            <Off
                posX={1400}
                invertY
                count={offBlack}
                color={Player.black}
                onClick={() => handleClickOff(Player.black)}
            />
            <Off posX={0} invertY disabled />
            <Off posX={0} disabled />
            <Off
                posX={1400}
                count={offWhite}
                color={Player.white}
                onClick={() => handleClickOff(Player.white)}
            />

            <Bar posX={700} invertY count={barWhite} color={Player.white} />
            <Bar posX={700} count={barBlack} color={Player.black} />

            {pips.map((pip, i) => {
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
