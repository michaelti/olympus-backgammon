const io = require("socket.io-client");
const { portes, plakoto, fevga, Variant } = require("olympus-bg");
const clone = require("ramda.clone");
const { Step } = require("./roomObj");

const think = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// Copied from frontend:
const cloneBoard = {
    [Variant.portes]: (boardState) => ({ ...portes.Board(), ...clone(boardState) }),
    [Variant.plakoto]: (boardState) => ({ ...plakoto.Board(), ...clone(boardState) }),
    [Variant.fevga]: (boardState) => ({ ...fevga.Board(), ...clone(boardState) }),
};

// Returns the best turn based on a set of possible turns and the board state
const pickTurn = {
    [Variant.portes]: (turns, board) => {
        const { turn } = turns.reduce(
            (bestTurn, currentTurn) => {
                const clonedBoard = clone(board);

                currentTurn.forEach((move) => {
                    clonedBoard.doMove(move.from, move.to);
                });

                const rank = rankBoard(clonedBoard);

                if (rank > bestTurn.rank) return { turn: currentTurn, rank };
                return bestTurn;
            },
            { turn: [], rank: -Infinity }
        );

        return turn;
    },
    [Variant.plakoto]: (turns) => turns[Math.floor(Math.random() * turns.length)],
    [Variant.fevga]: (turns) => turns[Math.floor(Math.random() * turns.length)],
};

// Heuristic function to rank a board state based on how "good" it is for Player.black
// Returns a score (higher is better)
function rankBoard(board) {
    let rank = 0;

    let sawBlack = false;
    let isEndGame = true;
    // The "endgame" is when there is no possibility of either player being sent to the bar
    for (let i = 25; i >= 0; i--) {
        if (board.pips[i].top === -1) sawBlack = true;
        else if (board.pips[i].top === 1 && sawBlack) {
            isEndGame = false;
            break;
        }
    }

    board.pips.forEach((pip, i) => {
        // An open checker deducts points based on distance it could be sent back
        if (pip.top === board.turn && pip.size === 1) {
            for (let j = i - 1; j >= 0; j--) {
                // If a white checker exists ahead
                if (board.pips[j].top === 1 && board.pips[j].size > 0) {
                    rank -= 24 - i;
                    break;
                }
            }
        }

        // A closed door while not in the endgame
        if (pip.top === board.turn && pip.size > 1 && !isEndGame) rank += 5;
    });

    // If we send the opponent to the bar
    rank += board.pips[0].size * 20;

    // If we bear off
    rank += board.off[-1] * 20;

    return rank;
}

function Bot(roomName) {
    let socket = io("http://localhost:" + process.env.PORT);
    let roomLocal = {};
    let player;
    let doingMove = false;
    let disconnectTimer;

    // Function to disconnect the bot after a period of inactivity
    const startDisconnectTimer = () => {
        const milliseconds = 300000; // 5 minutes

        clearTimeout(disconnectTimer);
        disconnectTimer = setTimeout(disconnect, milliseconds);

        function disconnect() {
            socket.disconnect();
            socket = null;
        }
    };

    startDisconnectTimer();

    // Join the room from the constructor
    socket.emit("event/join-room", roomName, (acknowledgement) => {
        if (acknowledgement.ok) {
            console.log(`Bot ${socket.id} joined room ${roomName}`);
            player = acknowledgement.player;
        } else {
            console.log(`Bot ${socket.id} failed to join room ${roomName}`);
        }
    });

    socket.on("room/update-room", async (room) => {
        startDisconnectTimer();

        roomLocal = { ...roomLocal, ...room };

        // Do a starting roll
        if (roomLocal.step === Step.startingRoll && !roomLocal.dice[player]) {
            await think(750);
            socket.emit("room/starting-roll");
        }

        // Game stuff
        if (roomLocal.step === Step.game && roomLocal.board.turn === player) {
            // Do a move
            if (roomLocal.board.turnValidity <= 0 && !doingMove) {
                doingMove = true;

                const logicBoard = cloneBoard[roomLocal.variant](roomLocal.board);

                // logicBoard.maxTurnLength = 0;
                logicBoard.uniqueTurns = new Map();
                logicBoard.possibleTurns = logicBoard.allPossibleTurns(true);
                for (const turn of logicBoard.possibleTurns) {
                    if (turn.length > logicBoard.maxTurnLength) {
                        logicBoard.maxTurnLength = turn.length;
                    }
                }

                // If the maxTurnLength is 4, we can use the pre-filtered uniqueTurns Map
                // otherwise we filter down possibleTurns because it may contain invalid turns
                const uniqueTurnsArray =
                    logicBoard.maxTurnLength === 4
                        ? Array.from(logicBoard.uniqueTurns.values())
                        : logicBoard.possibleTurns.filter((turn) => {
                              return logicBoard.turnValidator(turn) > 0;
                          });

                // Clear these so we don't waste resources cloning them in pickTurn()
                logicBoard.possibleTurns = null;
                logicBoard.uniqueTurns = null;

                // Select the best turn for the bot to choose
                const turn = pickTurn[roomLocal.variant](uniqueTurnsArray, logicBoard);

                turn.forEach(async (move, i) => {
                    await think(750 * (i + 1));
                    socket.emit("game/move", move.from, move.to);
                });
            }

            // Finish a turn
            if (roomLocal.board.turnValidity > 0) {
                socket.emit("game/apply-turn");
                doingMove = false;
            }
        }
    });
}

module.exports = Bot;
