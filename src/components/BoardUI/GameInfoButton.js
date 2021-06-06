import React from "react";
import styled from "styled-components";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import { Player } from "../../util";
import ConnectionStatus from "../ConnectionStatus";
import { Link } from "react-router-dom";
import Button from "./Button";

const Container = styled.div`
    background-color: #402d26;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 5px 0;
`;

const InfoButton = styled(Button)`
    width: 100%;
    padding: 0;
    font-weight: bold;
    background-color: #745138;
    color: #fff;

    &:hover,
    &:active,
    &:focus {
        background-color: #c49158;
    }
`;

function GameInfoButton({ player, score, roomName }) {
    return (
        <Container>
            <InfoButton label="Info" id="game-info-popover">
                &#8942;
            </InfoButton>
            <UncontrolledPopover placement="right" trigger="legacy" target="game-info-popover">
                <PopoverHeader>
                    Olympus Backgammon
                    <span className="float-right ml-3">
                        <ConnectionStatus />
                    </span>
                </PopoverHeader>
                <PopoverBody>
                    <div>
                        Score:{" "}
                        <strong>
                            White {score[Player.white]} – {score[Player.black]} Black
                        </strong>
                    </div>
                    <div>
                        {player
                            ? `Playing as ${Player.properties[player].colorName}`
                            : "Spectating"}
                    </div>
                    <hr />
                    <div>
                        <h6>Invite a friend</h6>
                        Game code: <strong>{roomName}</strong>
                        <br />
                        <Link to={window.location.href}>{window.location.href}</Link>
                    </div>
                    <hr />
                    <Link to="/">&larr; Leave game</Link>
                </PopoverBody>
            </UncontrolledPopover>
        </Container>
    );
}

export default GameInfoButton;
