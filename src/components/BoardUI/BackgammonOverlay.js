import React from "react";
import styled from "styled-components";
import { Button } from "reactstrap";
import Die from "./Die";
import { socketEmit } from "../../api";
import { Player } from "../../util";

const Overlay = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.25);
    color: #ffffff;
    display: flex;
    padding: 0 3.333%;

    > div {
        flex: 0 0 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        > *:not(:last-child) {
            margin-bottom: 0.5em;
        }
    }
`;

function BackgammonOverlay({ dieWhite, dieBlack, dieDraw, player }) {
    const doStartingRoll = () => {
        socketEmit("room/starting-roll");
    };

    const white = dieWhite || dieDraw;
    const black = dieBlack || dieDraw;

    return (
        <Overlay>
            <div>
                {white ? <Die number={white} /> : null}
                {player === Player.white && !dieWhite ? (
                    <Button onClick={doStartingRoll}>
                        {!dieDraw ? "Roll to go first" : "Roll again"}
                    </Button>
                ) : null}
            </div>
            <div>
                {black ? <Die number={black} /> : null}
                {player === Player.black && !dieBlack ? (
                    <Button onClick={doStartingRoll}>
                        {!dieDraw ? "Roll to go first" : "Roll again"}
                    </Button>
                ) : null}
            </div>
        </Overlay>
    );
}

export default BackgammonOverlay;
