const io = require("socket.io")(process.env.PORT, {
    serveClient: false,
});
const clone = require("ramda.clone");
const plakoto = require("./plakoto.js");
const util = require("./util.js");

io.on("connection", (socket) => {
    let board = plakoto.Board();
    let boardBackup = clone(board);
    let submoves = new Array();
    socketOnConnected();

    /* ROOM EVENT LISTENERS */

    // Room event: start room
    socket.on("event/start-room", (acknowledge) => {
        // Generate a random room name string
        const roomName = util.randomAlphanumeric(6);

        // Join ("create") the room
        socket.join(roomName, () => {
            // Send the room name back to the client
            acknowledge({ ok: true, roomName });
        });
    });

    // Room event: join room
    socket.on("event/join-room", (roomName, acknowledge) => {
        // Check if the room exists
        if (io.sockets.adapter.rooms[roomName]) {
            socket.join(roomName, () => {
                // Send the room name back to the client
                acknowledge({ ok: true, roomName });
            });
        } else {
            // Send a failure event back to the client
            acknowledge({ ok: false, roomName });
        }
    });

    /* GAME EVENT LISTENERS */

    // Game event: submove
    socket.on("game/submove", (from, to) => {
        if (board.trySubmove(from, to)) {
            submoves.push(plakoto.Submove(from, to));
        }
        sendUpdatedBoard(board);
    });

    // Game event: apply turn
    socket.on("game/apply-turn", () => {
        /* Validate the whole turn by passing the array of submoves to a method
         * If the move is valid, end the player's turn
         * Else, return an error and undo the partial move
         */
        if (boardBackup.isTurnValid(submoves)) {
            board.turn = board.otherPlayer();
            board.rollDice();
            boardBackup = clone(board);
        } else {
            board = clone(boardBackup);
        }
        submoves = [];
        sendUpdatedBoard(board);
    });

    // Game event: undo
    socket.on("game/undo", () => {
        submoves = [];
        board = clone(boardBackup);
        sendUpdatedBoard(board);
    });

    /* GAME EVENT EMITTERS */

    // Send an updated board object to the client(s)
    function sendUpdatedBoard(board) {
        socket.emit("game/update-board", board);
    }

    /* SOCKET CONNECTION EVENT LISTENERS */

    // Client connected
    function socketOnConnected() {
        console.log(`Client connected (id: ${socket.id})`);
        board.initPlakoto();
        boardBackup = clone(board);
        sendUpdatedBoard(board);
    }

    // Client disconnecting
    socket.on("disconnecting", () => {
        // Log that the client is disconnecting from each room they were in, if any.
        Object.keys(socket.rooms).forEach((roomName) => {
            if (roomName === socket.id) return;
            console.log(`Client is disconnecting from room ${roomName} (id: ${socket.id})`);
        });
    });

    // Client disconnected
    socket.on("disconnect", () => {
        console.log(`Client disconnected (id: ${socket.id})`);
    });
});
