/* GAME EVENT LISTENERS */

module.exports = function (socket, io, rooms = io.sockets.adapter.rooms) {
    // Game event: move
    socket.on("game/move", (from, to) => {
        if (!socket.currentRoom) return;
        if (!rooms[socket.currentRoom].isPlayerTurn(socket.id) && !process.env.GAMEDEV) return;

        rooms[socket.currentRoom].gameMove(from, to);

        // Broadcast the board to everyone in the room
        io.sockets
            .in(socket.currentRoom)
            .emit("room/update-room", { board: rooms[socket.currentRoom].board });
    });

    // Game event: apply turn
    socket.on("game/apply-turn", () => {
        if (!socket.currentRoom) return;
        if (!rooms[socket.currentRoom].isPlayerTurn(socket.id) && !process.env.GAMEDEV) return;

        rooms[socket.currentRoom].gameApplyTurn();

        // Broadcast the board to everyone in the room
        io.sockets
            .in(socket.currentRoom)
            .emit("room/update-room", { board: rooms[socket.currentRoom].board });

        // Broadcast the room step if the game has ended
        if (rooms[socket.currentRoom].board.winner !== null) {
            io.sockets.in(socket.currentRoom).emit("room/update-room", {
                step: rooms[socket.currentRoom].step,
            });
        }
    });

    // Game event: undo
    socket.on("game/undo-turn", () => {
        if (!socket.currentRoom) return;
        if (!rooms[socket.currentRoom].isPlayerTurn(socket.id) && !process.env.GAMEDEV) return;

        while (rooms[socket.currentRoom].moves.length > 0) {
            rooms[socket.currentRoom].gameUndoMove();

            // Broadcast the board to everyone in the room
            io.sockets
                .in(socket.currentRoom)
                .emit("room/update-room", { board: rooms[socket.currentRoom].board });
        }
    });

    // Game event: undo
    socket.on("game/undo-move", () => {
        if (!socket.currentRoom) return;
        if (!rooms[socket.currentRoom].isPlayerTurn(socket.id) && !process.env.GAMEDEV) return;

        rooms[socket.currentRoom].gameUndoMove();

        // Broadcast the board to everyone in the room
        io.sockets
            .in(socket.currentRoom)
            .emit("room/update-room", { board: rooms[socket.currentRoom].board });
    });
};
