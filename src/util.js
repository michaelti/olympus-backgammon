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
export const RoomState = Object.freeze({
    undefined: 0,
    setup: 1,
    startingRoll: 2,
    game: 3,
});
