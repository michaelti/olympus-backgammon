// Player enum to match the backend
export const Player = Object.freeze({
    neither: 0,
    white: 1,
    black: -1,
    properties: {
        "0": { colorName: "Neither" },
        "1": { colorName: "White" },
        "-1": { colorName: "Black" },
    },
});

// Room state enum to match the backend
export const RoomStep = Object.freeze({
    setup: 1,
    startingRoll: 2,
    game: 3,
});

// Variant of backgammon enum to match the backend
export const Variant = Object.freeze({
    portes: 1,
    plakoto: 2,
    fevga: 3,
    properties: {
        "1": { name: "Portes" },
        "2": { name: "Plakoto" },
        "3": { name: "Fevga" },
    },
});

// Turn validity enum to match the backend
export const TurnMessage = Object.freeze({
    valid: 1,
    validZero: 2,
    invalid: 0,
    invalidMoreMoves: -1,
    invalidLongerMove: -2,
    properties: {
        "1": { text: "Finish turn" },
        "2": { text: "Finish turn (no moves)" },
        "0": { text: "You must move first" },
        "-1": { text: "You must move more first" },
        "-2": { text: "You must move the larger dice" },
    },
});
