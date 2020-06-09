// Enum-like object to match data from the back-end
export const Player = Object.freeze({
    neither: 0,
    white:  1,
    black: -1,
    properties: {
        '0':  { colorName: 'Neither' },
        '1':  { colorName: 'White' },
        '-1': { colorName: 'Black' },
    },
});
