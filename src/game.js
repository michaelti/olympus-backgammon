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
        return false;
    },
};
