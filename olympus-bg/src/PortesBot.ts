import { Game } from "./Game.js";
import { Move } from "./types.js";
import { BAR, OFF, pipDistance, range } from "./util.js";

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

/**
 * Heuristic function to rank a board state based on how "good" it is for the current player
 * Returns a score (higher is better)
 */
function rankBoard(game: Game): number {
    let rank = 0;

    if (isEndGame(game)) {
        // While in endgame, the priority should be moving all checkers to home quadrant
        for (const [i, pip] of game.pips.entries()) {
            // A penalty of 1 point per space from home is applied
            const isHome = pipDistance(OFF[game.player], i) <= 6;
            const distanceFromHome = pipDistance(OFF[game.player], i) - 6;
            const penalty = isHome ? 0 : distanceFromHome;

            if (pip.owner === game.player) {
                rank -= pip.size * penalty;
            }
        }
    } else {
        for (const [i, pip] of game.pips.entries()) {
            // An open checker deducts points based on distance it could be sent back
            if (pip.owner === game.player && pip.size === 1) {
                for (const j of range(i, OFF[game.player])) {
                    // If an opposing checker exists ahead
                    if (game.pips[j].owner === game.otherPlayer() && game.pips[j].size >= 1) {
                        rank -= pipDistance(BAR[game.player], i);
                        break;
                    }
                }
            }

            // A closed door (i.e. a stack of 2 or more)
            if (pip.owner === game.player && pip.size > 1) {
                rank += 5;
            }
        }

        // If we send the opponent to the bar
        rank += game.pips[BAR[game.otherPlayer()]].size * 20;
    }

    // If we bear off
    rank += game.off[game.player] * 20;

    return rank;
}

/**
 * Returns the best sequence of moves for the current player
 * Must be called at the beginning of a turn
 */
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
