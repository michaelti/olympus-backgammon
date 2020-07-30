import React, { useState } from "react";
import Pip from "./Pip";
import Off from "./Off";
import Bar from "./Bar";
import BackgroundSVG from "./svg/background.svg";
import { Player } from "../../util.js";

function BackgammonBoard({ boardState: { pips, off, turn }, isTurn, doMove, getPossiblePips }) {
    const [moving, setMoving] = useState(false);
    const [sourcePip, setSourcePip] = useState(undefined);
    const [highlightedPips, setHighlightedPips] = useState(null);

    const clearMove = () => {
        setHighlightedPips(null);
        setSourcePip(undefined);
        setMoving(false);
    };

    const startMove = (from) => {
        if (isTurn && pips[from].top === turn && pips[from].size > 0) {
            setMoving(true);
            setSourcePip(from);
            setHighlightedPips(getPossiblePips(from));
        }
    };

    const handleClickPip = (clickedPip) => {
        if (!moving) startMove(clickedPip);
        else {
            // We are moving; complete the move if it's valid (and not to the bar)
            if (highlightedPips.has(clickedPip) && clickedPip !== 0 && clickedPip !== 25) {
                doMove(sourcePip, clickedPip);
                clearMove();
            } else {
                // Try to start a new move if this one wasn't valid
                clearMove();
                startMove(clickedPip);
            }
        }
    };

    const handleClickOff = (clickedOff) => {
        if (moving) {
            if (clickedOff === Player.white) doMove(sourcePip, 25);
            if (clickedOff === Player.black) doMove(sourcePip, 0);
            clearMove();
        }
    };

    return (
        <svg viewBox="0 0 1500 1200" style={{ width: "100%" }}>
            <image href={BackgroundSVG} width="1500" height="1200" />

            <Off
                posX={1400}
                invertY
                count={off[Player.black]}
                color={Player.black}
                onClick={() => handleClickOff(Player.black)}
                highlighted={highlightedPips?.has(0)}
            />
            <Off posX={0} invertY disabled />
            <Off posX={0} disabled />
            <Off
                posX={1400}
                count={off[Player.white]}
                color={Player.white}
                onClick={() => handleClickOff(Player.white)}
                highlighted={highlightedPips?.has(25)}
            />

            <Bar
                posX={700}
                invertY
                count={pips[0].size /* Special bar pip */}
                color={Player.white}
                onClick={() => handleClickPip(0)}
                active={sourcePip === 0}
            />
            <Bar
                posX={700}
                count={pips[25].size /* Special bar pip */}
                color={Player.black}
                onClick={() => handleClickPip(25)}
                active={sourcePip === 25}
            />

            {pips.map((pip, i) => {
                if (i === 0 || i === 25) return null;

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
                        highlighted={highlightedPips?.has(i)}
                    />
                );
            })}
        </svg>
    );
}

export default BackgammonBoard;
