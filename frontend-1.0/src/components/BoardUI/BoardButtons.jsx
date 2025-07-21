import React from "react";
import styled from "styled-components";
import Button from "./Button";
import { TurnMessage } from "../../util";

const Buttons = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;
    background-color: #402d26;
    padding: 5px 0;
    margin: 0 -5px;
    gap: 5px;
`;

const BoardButton = styled(Button)`
    font-weight: bold;
    padding: 0 0.5em;
`;

function BoardButtons({ applyTurn, undoMove, canUndo, turnValidity }) {
    return (
        <Buttons>
            <BoardButton
                onClick={applyTurn}
                disabled={turnValidity <= 0}
                label={TurnMessage.properties[turnValidity].text}>
                &#10003;
            </BoardButton>
            <BoardButton onClick={undoMove} disabled={!canUndo} label="Undo move">
                &#8634;
            </BoardButton>
        </Buttons>
    );
}

export default BoardButtons;
