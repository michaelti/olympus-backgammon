require("dotenv").config();
const io = require("socket.io")(process.env.PORT, {
    serveClient: false,
});
const clone = require("ramda.clone");
const plakoto = require("./plakoto.js");
const util = require("./util.js");
const gameUtil = require("./gameUtil");

io.on("connection", (socket) => {
    let currentRoom = null;

    socketOnConnected();

    /* ROOM EVENT LISTENERS */

    // Room event: start room
    socket.on("event/start-room", (acknowledge) => {
        // Generate a random room name string
        const roomName = util.randomAlphanumeric(6);

        // Create ("join") the room
        socket.join(roomName, () => {
            // Leave previous room if already in one
            if (currentRoom && currentRoom.roomName !== roomName) {
                // Remove entry from the players object of the current room, if any.
                if (currentRoom.players) delete currentRoom.players[socket.id];
                socket.leave(currentRoom.roomName);
            }

            // Set the current room reference
            currentRoom = io.sockets.adapter.rooms[roomName];
            currentRoom.roomName = roomName;

            // Initialize a game for the current room
            currentRoom.board = plakoto.Board();
            currentRoom.board.initPlakoto();
            currentRoom.boardBackup = clone(currentRoom.board);
            currentRoom.submoves = new Array();

            // Initialize a list of players for the current room
            currentRoom.players = {};

            // Send the room name back to the client
            acknowledge({ ok: true, roomName });
        });
    });

    // Room event: join room
    socket.on("event/join-room", (roomName, acknowledge) => {
        // Check if the room exists
        if (io.sockets.adapter.rooms[roomName]) {
            socket.join(roomName, () => {
                // Leave previous room if already in one
                if (currentRoom && currentRoom.roomName !== roomName) {
                    // Remove entry from the players object of the current room, if any.
                    if (currentRoom.players) delete currentRoom.players[socket.id];
                    socket.leave(currentRoom.roomName);
                }

                // Set the current room reference
                currentRoom = io.sockets.adapter.rooms[roomName];
                currentRoom.roomName = roomName;

                // Add entry to the players list for this room, if there's space.
                if (!currentRoom.players[socket.id]) {
                    if (Object.keys(currentRoom.players).length < 2) {
                        if (!Object.values(currentRoom.players).includes(gameUtil.Player.white)) {
                            currentRoom.players[socket.id] = gameUtil.Player.white;
                        } else {
                            currentRoom.players[socket.id] = gameUtil.Player.black;
                        }
                    }
                }

                // Broadcast the board to everyone in the room
                sendUpdatedBoard(currentRoom.board);

                // Send the room name back to the client
                acknowledge({ ok: true, roomName, player: currentRoom.players[socket.id] });
            });
        } else {
            // Send a failure event back to the client
            acknowledge({ ok: false, roomName });
        }
    });

    /* GAME EVENT LISTENERS */

    // Game event: submove
    socket.on("game/submove", (from, to) => {
        if (!currentRoom) return;
        if (currentRoom.players[socket.id] !== currentRoom.board.turn) return;

        if (currentRoom.board.trySubmove(from, to)) {
            currentRoom.submoves.push(plakoto.Submove(from, to));
        }
        sendUpdatedBoard(currentRoom.board);
    });

    // Game event: apply turn
    socket.on("game/apply-turn", () => {
        if (!currentRoom) return;
        if (currentRoom.players[socket.id] !== currentRoom.board.turn) return;

        /* Validate the whole turn by passing the array of submoves to a method
         * If the move is valid, end the player's turn
         * Else, return an error and undo the partial move
         */
        if (currentRoom.boardBackup.isTurnValid(currentRoom.submoves)) {
            currentRoom.board.turn = currentRoom.board.otherPlayer();
            currentRoom.board.rollDice();
            currentRoom.boardBackup = clone(currentRoom.board);
        } else {
            currentRoom.board = clone(currentRoom.boardBackup);
        }
        currentRoom.submoves = [];
        sendUpdatedBoard(currentRoom.board);
    });

    // Game event: undo
    socket.on("game/undo", () => {
        if (!currentRoom) return;
        if (currentRoom.players[socket.id] !== currentRoom.board.turn) return;

        currentRoom.submoves = [];
        currentRoom.board = clone(currentRoom.boardBackup);
        sendUpdatedBoard(currentRoom.board);
    });

    /* GAME EVENT EMITTERS */

    // Send an updated board object to the client(s)
    function sendUpdatedBoard(board) {
        io.sockets.in(currentRoom.roomName).emit("game/update-board", board);
    }

    /* SOCKET CONNECTION EVENT LISTENERS */

    // Client connected
    function socketOnConnected() {
        console.log(`Client connected (id: ${socket.id})`);
    }

    // Client disconnecting
    socket.on("disconnecting", () => {
        // Remove the client from the players object of the current room, if any.
        if (currentRoom && currentRoom.players) {
            delete currentRoom.players[socket.id];
        }

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
