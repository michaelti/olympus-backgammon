const plakoto = require("../plakoto.js");
const clone = require("ramda.clone");
const util = require("../util.js");
const gameUtil = require("../gameUtil");

/* ROOM EVENT LISTENERS */

module.exports = function (socket, io) {
    // Room event: start room
    socket.on("event/start-room", (acknowledge) => {
        // Generate a random room name string
        const roomName = util.randomAlphanumeric(6);

        // Create ("join") the room
        socket.join(roomName, () => {
            // Leave previous room if already in one
            if (socket.currentRoom && socket.currentRoom.roomName !== roomName) {
                // Remove entry from the players object of the current room, if any.
                if (socket.currentRoom.players) delete socket.currentRoom.players[socket.id];
                socket.leave(socket.currentRoom.roomName);
            }

            // Set the current room reference
            socket.currentRoom = io.sockets.adapter.rooms[roomName];
            socket.currentRoom.roomName = roomName;

            // Initialize a game for the current room
            socket.currentRoom.board = plakoto.Board();
            socket.currentRoom.board.initPlakoto();
            socket.currentRoom.boardBackup = clone(socket.currentRoom.board);
            socket.currentRoom.moves = new Array();

            // Initialize a list of players for the current room
            socket.currentRoom.players = {};

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
                if (socket.currentRoom && socket.currentRoom.roomName !== roomName) {
                    // Remove entry from the players object of the current room, if any.
                    if (socket.currentRoom.players) delete socket.currentRoom.players[socket.id];
                    socket.leave(socket.currentRoom.roomName);
                }

                // Set the current room reference
                socket.currentRoom = io.sockets.adapter.rooms[roomName];
                socket.currentRoom.roomName = roomName;

                // Add entry to the players list for this room, if there's space.
                if (!socket.currentRoom.players[socket.id]) {
                    if (Object.keys(socket.currentRoom.players).length < 2) {
                        if (
                            !Object.values(socket.currentRoom.players).includes(
                                gameUtil.Player.white
                            )
                        ) {
                            socket.currentRoom.players[socket.id] = gameUtil.Player.white;
                        } else {
                            socket.currentRoom.players[socket.id] = gameUtil.Player.black;
                        }
                    }
                }

                // Broadcast the board to everyone in the room
                io.sockets
                    .in(socket.currentRoom.roomName)
                    .emit("game/update-board", socket.currentRoom.board);

                // Send the room name back to the client
                acknowledge({
                    ok: true,
                    roomName,
                    player: socket.currentRoom.players[socket.id],
                });
            });
        } else {
            // Send a failure event back to the client
            acknowledge({ ok: false, roomName });
        }
    });
};
