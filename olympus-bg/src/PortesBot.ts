import { Game } from "./Game.js";
import { Move } from "./types.js";

/**
 * The "endgame" is when there is no possibility of either player being sent to the bar
 */
function isEndGame(game: Game): boolean {
    let sawBlack = false;
    let isEndGame = true;

    for (let i = 25; i >= 0; i--) {
        // Skip empty pips
        if (game.pips[i].size === 0) {
            continue;
        } else if (game.pips[i].owner === "black") {
            sawBlack = true;
        } else if (game.pips[i].owner === "white" && sawBlack) {
            isEndGame = false;
            break;
        }
    }

    return isEndGame;
}

// TODO: make this work for either player white or black
/**
 * Heuristic function to rank a board state based on how "good" it is for Player.black
 * Returns a score (higher is better)
 */
function rankBoard(game: Game): number {
    let rank = 0;

    if (isEndGame(game)) {
        // While in endgame, the priority should be moving all checkers to home quadrant
        game.pips.forEach((pip, i) => {
            // A penalty of 1 point per space from home is applied
            const spacesFromHome = i < 6 ? 0 : i - 6;

            if (pip.owner === game.player) {
                rank -= pip.size * spacesFromHome;
            }
        });
    } else {
        game.pips.forEach((pip, i) => {
            // An open checker deducts points based on distance it could be sent back
            if (pip.owner === game.player && pip.size === 1) {
                for (let j = i - 1; j >= 0; j--) {
                    // If a white checker exists ahead
                    if (game.pips[j].owner === "white") {
                        rank -= 24 - i;
                        break;
                    }
                }
            }

            // A closed door (i.e. a stack of 2 or more)
            if (pip.owner === game.player && pip.size > 1) {
                rank += 5;
            }
        });

        // If we send the opponent to the bar
        rank += game.pips[0].size * 20;
    }

    // If we bear off
    rank += game.off.black * 20;

    return rank;
}

// TODO: test this
export function getBestTurn(game: Game): Move[] {
    const turns = Game.getAllPossibleValidTurns(game);

    let bestRank = -Infinity;
    let bestTurn: Move[] = [];

    for (const turn of turns) {
        const gameClone = game.clone();

        for (const move of turn) {
            gameClone.doMove(move.from, move.to);
        }

        const rank = rankBoard(gameClone);

        if (rank > bestRank) {
            bestRank = rank;
            bestTurn = turn;
        }
    }

    return bestTurn;
}
