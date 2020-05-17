const io = require('socket.io')(process.env.PORT, {
    serveClient: false,
});

io.on('connection', (socket) => {

    // Client event: start room
    socket.on('event/start-room', () => {
        // Generate a random room name string
        const roomName = randomAalphanumeric(6);

        // Join ("create") the room
        socket.join(roomName, () => {
            // Send the room name back to the client
            socket.emit('event/joined-room', roomName);
        });
    });

    // Client event: join room
    socket.on('event/join-room', (roomName) => {
        // Check if the room exists
        if (io.sockets.adapter.rooms[roomName]) {
            socket.join(roomName, () => {
                // Send the room name back to the client
                socket.emit('event/joined-room', roomName);
            });
        } else {
            // Send a failure event back to the client
            socket.emit('event/failed-join-room', roomName);
        }
    });


    /* Basic connection events */

    // Client connected
    console.log(`Client connected (id: ${socket.id})`);

    // Client disconnecting
    socket.on('disconnecting', () => {
        // Log that the client is disconnecting from each room they were in, if any.
        Object.keys(socket.rooms).forEach((roomName) => {
            if (roomName === socket.id) return;
            console.log(`Client is disconnecting from room ${roomName} (id: ${socket.id})`);
        });
    });

    // Client disconnected
    socket.on('disconnect', () => {
        console.log(`Client disconnected (id: ${socket.id})`);
    });

});



// Helper to return random alphanumeric string of length n
function randomAalphanumeric(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}
