import { portes, plakoto, fevga } from "olympus-bg";
import { Variant } from "./util";

export const isMoveValid = {
    [Variant.portes]: (from, to, board) => ({ ...portes.Board(), ...board }.isMoveValid(from, to)),
    [Variant.fevga]: (from, to, board) => ({ ...fevga.Board(), ...board }.isMoveValid(from, to)),
    [Variant.plakoto]: (from, to, board) =>
        ({ ...plakoto.Board(), ...board }.isMoveValid(from, to)),
};
