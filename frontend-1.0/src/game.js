import { portes, plakoto, fevga } from "olympus-bg";
import { Variant } from "./util";
import clone from "ramda.clone";

export const cloneBoard = {
    [Variant.portes]: (boardState) => ({ ...portes.Board(), ...clone(boardState) }),
    [Variant.plakoto]: (boardState) => ({ ...plakoto.Board(), ...clone(boardState) }),
    [Variant.fevga]: (boardState) => ({ ...fevga.Board(), ...clone(boardState) }),
};
