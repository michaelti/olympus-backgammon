import React from "react";
import { Player } from "../util";

function ScoreScreen({ winner, score }) {
    if (winner === null) return null;

    return (
        <div>
            {Player.properties[winner].colorName} won! Score:{" "}
            <strong>
                White {score[Player.white]} – {score[Player.black]} Black
            </strong>
        </div>
    );
}

export default ScoreScreen;
