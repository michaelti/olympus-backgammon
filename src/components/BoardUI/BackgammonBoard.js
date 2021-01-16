import React, { useState } from "react";
import { Player } from "../../util.js";
import styled from "styled-components";
import CheckerStack from "./CheckerStack";
import Dice from "./Dice";
import BoardButtons from "./BoardButtons";

const Board = styled.div`
    background: #402d26;
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(15, minmax(0, 1fr));
    grid-template-rows: minmax(0, 1fr) 50px minmax(0, 1fr);
    grid-column-gap: 5px;
    grid-template-areas:
        "top-left p13 p14 p15 p16 p17 p18 top-mid p19 p20 p21 p22 p23 p24 top-right"
        "mid-left ui-l ui-l ui-l ui-l ui-l ui-l mid-mid ui-r ui-r ui-r ui-r ui-r ui-r mid-right"
        "bot-left p12 p11 p10 p9 p8 p7 bot-mid p6 p5 p4 p3 p2 p1 bot-right";
`;

const BoardChild = styled.div`
    grid-area: ${(props) => props.gridArea};
    background-color: ${(props) => props.canMoveTo && "gray"} !important;
    cursor: ${(props) => (props.canMoveFrom || props.canMoveTo) && "pointer"};
`;

const Pip = styled(BoardChild)`
    margin-top: ${(props) => props.reverse && "15px"};
    margin-bottom: ${(props) => !props.reverse && "15px"};
    position: relative;
    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 600' preserveAspectRatio='none'%3E%3Cpolygon points='50 500 100 0 0 0 50 500' fill='%23f7d086'/%3E%3C/svg%3E");
        background-size: 100% 100%;
        transform: ${(props) => props.reverse && "scaleY(-1)"};
    }
`;

const Bar = styled(BoardChild)`
    background-color: #c49158;
`;

const Off = styled(BoardChild)`
    background-color: #745138;
`;

function BackgammonBoard({
    boardState: { pips, off, turn, recentMove, dice, diceRolled, turnValidity },
    isTurn,
    doMove,
    getPossiblePips,
    flipOffWhite,
    applyTurn,
    undoMove,
    startingRollW,
    startingRollB,
    gameInfoButton,
}) {
    const [moving, setMoving] = useState(false);
    const [sourcePip, setSourcePip] = useState(null);
    const [highlightedPips, setHighlightedPips] = useState({});

    const clearMove = () => {
        setHighlightedPips({});
        setSourcePip(null);
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
            if (clickedPip in highlightedPips && clickedPip !== 0 && clickedPip !== 25) {
                doMove(sourcePip, highlightedPips[clickedPip]);
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
            if (clickedOff === Player.white && 25 in highlightedPips) {
                doMove(sourcePip, highlightedPips[25]);
            }

            if (clickedOff === Player.black && 0 in highlightedPips) {
                doMove(sourcePip, highlightedPips[0]);
            }

            clearMove();
        }
    };

    return (
        <Board>
            {pips.map((pip, i) => {
                if (i === 0 || i === 25)
                    return (
                        <Bar
                            key={i}
                            onClick={() => handleClickPip(i)}
                            canMoveFrom={isTurn && pip.top === turn && pip.size > 0}
                            gridArea={i === 0 ? "bot-mid" : "top-mid"}>
                            <CheckerStack
                                size={pip.size}
                                top={pip.top}
                                bot={pip.bot}
                                reverse={i > 12}
                                recentMove={recentMove}
                                pipNum={i}
                                isSource={i === sourcePip}
                            />
                        </Bar>
                    );

                return (
                    <Pip
                        key={i}
                        onClick={() => handleClickPip(i)}
                        canMoveTo={i in highlightedPips}
                        canMoveFrom={isTurn && pip.top === turn && pip.size > 0}
                        gridArea={"p" + i}
                        reverse={i <= 12}>
                        <CheckerStack
                            size={pip.size}
                            top={pip.top}
                            bot={pip.bot}
                            reverse={i <= 12}
                            recentMove={recentMove}
                            pipNum={i}
                            isSource={i === sourcePip}
                        />
                    </Pip>
                );
            })}
            {/* <!-- --> */}
            <Off
                gridArea={flipOffWhite ? "top-left" : "top-right"}
                onClick={() => handleClickOff(Player.white)}
                canMoveTo={25 in highlightedPips}>
                <CheckerStack
                    size={off[Player.white]}
                    top={Player.white}
                    bot={Player.white}
                    reverse={false}
                    recentMove={recentMove}
                    pipNum={25}
                />
            </Off>
            <Off
                gridArea="bot-right"
                onClick={() => handleClickOff(Player.black)}
                canMoveTo={0 in highlightedPips}>
                <CheckerStack
                    size={off[Player.black]}
                    top={Player.black}
                    bot={Player.black}
                    reverse={true}
                    recentMove={recentMove}
                    pipNum={0}
                />
            </Off>
            {/* <!-- --> */}
            <Off gridArea={flipOffWhite ? "top-right" : "top-left"}></Off>
            <Off gridArea="bot-left"></Off>
            {/* <!-- UI --> */}
            <Off gridArea="mid-left">{gameInfoButton}</Off>
            <Off gridArea="mid-right"></Off>
            <BoardChild gridArea="ui-l">
                {startingRollW}
                {turn === Player.white && <Dice initialDice={diceRolled} remainingDice={dice} />}
            </BoardChild>
            <BoardChild gridArea="ui-r">
                {startingRollB}
                {turn === Player.black && <Dice initialDice={diceRolled} remainingDice={dice} />}
            </BoardChild>
            <Bar gridArea="mid-mid">
                {isTurn && (
                    <BoardButtons
                        applyTurn={applyTurn}
                        undoMove={undoMove}
                        canUndo={dice.length < diceRolled.length}
                        turnValidity={turnValidity}
                    />
                )}
            </Bar>
        </Board>
    );
}

export default BackgammonBoard;
