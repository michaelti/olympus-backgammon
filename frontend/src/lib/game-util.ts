import type { Move, Game, GameData } from "olympus-bg";

/**
 * Determines where a player can go from a given pip
 * Includes pip skipping
 *
 * @param from Start pip
 * @param game Game instance
 * @returns Map<To pip, Moves>
 */
export const getDestinations = (
    from: number,
    game: Game,
    moves: Move[] = [],
    map = new Map<number, Move[]>(),
) => {
    // Do not modify the game instance
    game = game.clone();

    const dice = [...new Set(game.dice)]; // Deduplication
    const tos = dice.map((die) => game.getDestination(from, die));

    for (const to of tos) {
        if (game.isMoveValid(from, to)) {
            const nextGame = game.clone();
            nextGame.doMove(from, to); // TODO: one-line when doMove returns move
            const move = nextGame.moves.at(-1) as Move; // TODO: don't assert
            const nextMoves = [...moves, move];
            map.set(to, nextMoves);
            getDestinations(to, nextGame, nextMoves, map);
        }
    }

    return map;
};

/**
 * Determines whether current player can try to move from a given pip
 */
export const canMoveFrom = (from: number, game: GameData) => {
    const pip = game.pips[from];
    return game.dice.length > 0 && pip.size > 0 && pip.owner === game.player;
};
