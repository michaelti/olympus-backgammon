import { Player, Variant } from "./util";

export const clamp = (to) => (to < 0 ? 0 : to > 25 ? 25 : to);
export const range = (start, end, length = end - start + 1) =>
    Array.from({ length }, (_, i) => start + i);

export const isMoveValid = {
    [Variant.portes]: function (from, to, board) {
        to = clamp(to);
        if (board.pips[from].top !== board.turn) return false;

        // Entering the board
        if (board.bar[board.turn].size > 0) {
            if (from !== 25 && from !== 0) return false;
            if (board.pips[to].top !== board.turn && board.pips[to].size > 1) return false;
            if (!board.dice.includes(board.turn * (to - from))) return false;
        }
        // Bearing off
        else if (to === 25 || to === 0) {
            if (board.turn === Player.white && from < 19) return false;
            if (board.turn === Player.black && from > 6) return false;
            // Range of all pips excluding the current player's home quadrant
            const nonHomePips = board.turn === Player.white ? range(1, 18) : range(7, 24);
            for (let i of nonHomePips) {
                if (board.pips[i].top === board.turn || board.pips[i].bot === board.turn)
                    return false;
            }
            // If bearing off from an non-exact number of pips
            if (!board.dice.includes(Math.abs(from - to))) {
                // Check if there's a big enough dice
                if (board.dice[0] > Math.abs(from - to) || board.dice[1] > Math.abs(from - to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip they are trying to bear off of
                    const farHomePips =
                        board.turn === Player.white ? range(19, from - 1) : range(from + 1, 6);
                    for (let i of farHomePips) {
                        if (board.pips[i].top === board.turn || board.pips[i].bot === board.turn)
                            return false;
                    }
                } else {
                    return false;
                }
            }
        }
        // Standard move
        else {
            if (from < 1 || from > 24 || to < 1 || to > 24) return false;
            if (board.pips[to].top !== board.turn && board.pips[to].size > 1) return false;
            if (!board.dice.includes(board.turn * (to - from))) return false;
        }

        return true;
    },
    [Variant.plakoto]: function (from, to, board) {
        to = clamp(to);
        if (board.pips[from].top !== board.turn) return false;

        // Bearing off
        if (to === 25 || to === 0) {
            if (board.turn === Player.white && from < 19) return false;
            if (board.turn === Player.black && from > 6) return false;
            // Range of all pips excluding the current player's home quadrant
            const nonHomePips = board.turn === Player.white ? range(1, 18) : range(7, 24);
            for (let i of nonHomePips) {
                if (board.pips[i].top === board.turn || board.pips[i].bot === board.turn)
                    return false;
            }
            // If bearing off from an non-exact number of pips
            if (!board.dice.includes(Math.abs(from - to))) {
                // Check if there's a big enough dice
                if (board.dice[0] > Math.abs(from - to) || board.dice[1] > Math.abs(from - to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip they are trying to bear off of
                    const farHomePips =
                        board.turn === Player.white ? range(19, from - 1) : range(from + 1, 6);
                    for (let i of farHomePips) {
                        if (board.pips[i].top === board.turn || board.pips[i].bot === board.turn)
                            return false;
                    }
                } else {
                    return false;
                }
            }
        }
        // Standard move
        else {
            if (from < 1 || from > 24 || to < 1 || to > 24) return false;
            if (board.pips[to].top !== board.turn && board.pips[to].size > 1) return false;
            if (!board.dice.includes(board.turn * (to - from))) return false;
        }

        return true;
    },
    [Variant.fevga]: function (from, to, board) {
        const State = Object.freeze({ start: 1, firstAway: 2, default: 3 });

        to = clamp(to);
        if (board.pips[from].top !== board.turn) return false;

        // You can't move from your big pile until you move past the other player's big pile
        if (board.state[board.turn] === State.firstAway) {
            if (from === 12 || from === 24) return false;
        }

        // Bearing off
        if (to === 25 || to === 0) {
            if (to === 25) to = 12;

            if (board.turn === Player.white && (from > 18 || from < 13)) return false;
            if (board.turn === Player.black && from > 6) return false;
            // Range of all pips excluding the current player's home quadrant
            const nonHomePips = board.turn === Player.white ? range(18, 35) : range(6, 23); // 1–12, 19–24 : 7–24
            for (let i of nonHomePips) {
                if (board.pips[(i % 24) + 1].top === board.turn) return false;
            }
            // If bearing off from an non-exact number of pips
            if (!board.dice.includes(Math.abs(from - to))) {
                // Check if there's a big enough dice
                if (board.dice[0] > Math.abs(from - to) || board.dice[1] > Math.abs(from - to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip they are trying to bear off of
                    const farHomePips =
                        board.turn === Player.white ? range(from + 1, 18) : range(from + 1, 6);
                    for (let i of farHomePips) {
                        if (board.pips[i].top === board.turn || board.pips[i].bot === board.turn)
                            return false;
                    }
                } else {
                    return false;
                }
            }
        }
        // Standard move
        else {
            if (from < 1 || from > 24 || to < 1 || to > 24) return false;
            if (board.pips[to].top !== board.turn && board.pips[to].size > 0) return false;
            if (board.turn === Player.white && from >= 13 && to <= 12) return false;
            if (board.turn === Player.black && from <= 12 && to >= 13) return false;

            // Don't allow player to block all home pips
            const homePips = board.turn === Player.white ? range(7, 12) : range(19, 24);
            const pipBackup = board.pips[to].top;
            board.pips[to].top = board.turn; // See what would happen IF the player were to move there
            let owned = 0;
            for (const i of homePips) if (board.pips[i].top === board.turn) owned++;
            board.pips[to].top = pipBackup; // Restore original board state
            if (owned >= 6 && board.pips[from].size > 1) return false;

            // Both players move in the same direction (decreasing). The exception is when we wrap
            // around the edge of the board, we jump by 24 (i.e. 3, 2, 1, 24, 23, 22)
            if (to > from) to -= 24;
            if (!board.dice.includes(from - to)) return false;
        }

        return true;
    },
};
