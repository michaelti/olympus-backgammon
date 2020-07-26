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
