/* SOCKET CONNECTION EVENT LISTENERS */

module.exports = function (socket, io, rooms = io.sockets.adapter.rooms) {
    // Client connected
    console.log(`Client connected (id: ${socket.id})`);

    // Client disconnecting
    socket.on("disconnecting", () => {
        // Remove the client from the players object of the current room, if any.
        if (socket.currentRoom && rooms[socket.currentRoom].players) {
            rooms[socket.currentRoom].removePlayer(socket.id);
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
};
