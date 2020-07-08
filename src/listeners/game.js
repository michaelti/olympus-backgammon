const plakoto = require("../plakoto.js");
const clone = require("ramda.clone");

/* GAME EVENT LISTENERS */

module.exports = function (socket, io) {
    // Game event: move
    socket.on("game/move", (from, to) => {
        if (!socket.currentRoom) return;
        if (socket.currentRoom.players[socket.id] !== socket.currentRoom.board.turn) return;

        if (socket.currentRoom.board.tryMove(from, to)) {
            socket.currentRoom.moves.push(plakoto.Move(from, to));
        }

        // Broadcast the board to everyone in the room
        io.sockets
            .in(socket.currentRoom.roomName)
            .emit("game/update-board", socket.currentRoom.board);
    });

    // Game event: apply turn
    socket.on("game/apply-turn", () => {
        if (!socket.currentRoom) return;
        if (socket.currentRoom.players[socket.id] !== socket.currentRoom.board.turn) return;

        /* Validate the whole turn by passing the array of moves to a method
         * If the turn is valid, end the player's turn
         * Else, return an error and undo the partial turn
         */
        if (socket.currentRoom.boardBackup.isTurnValid(socket.currentRoom.moves)) {
            socket.currentRoom.board.turn = socket.currentRoom.board.otherPlayer();
            socket.currentRoom.board.rollDice();
            socket.currentRoom.boardBackup = clone(socket.currentRoom.board);
        } else {
            socket.currentRoom.board = clone(socket.currentRoom.boardBackup);
        }
        socket.currentRoom.moves = [];

        // Broadcast the board to everyone in the room
        io.sockets
            .in(socket.currentRoom.roomName)
            .emit("game/update-board", socket.currentRoom.board);
    });

    // Game event: undo
    socket.on("game/undo", () => {
        if (!socket.currentRoom) return;
        if (socket.currentRoom.players[socket.id] !== socket.currentRoom.board.turn) return;

        socket.currentRoom.moves = [];
        socket.currentRoom.board = clone(socket.currentRoom.boardBackup);

        // Broadcast the board to everyone in the room
        io.sockets
            .in(socket.currentRoom.roomName)
            .emit("game/update-board", socket.currentRoom.board);
    });
};
