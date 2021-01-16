import { portes, plakoto, fevga } from "olympus-bg";
import { Variant, Player } from "./util";
import clone from "ramda.clone";

export const cloneBoard = {
    [Variant.portes]: (boardState) => {
        const board = { ...portes.Board(), ...clone(boardState) };
        board.bar = { [Player.black]: board.pips[25], [Player.white]: board.pips[0] };
        return board;
    },
    [Variant.plakoto]: (boardState) => ({ ...plakoto.Board(), ...clone(boardState) }),
    [Variant.fevga]: (boardState) => ({ ...fevga.Board(), ...clone(boardState) }),
};
