const io = require('socket.io')(process.env.PORT, {
    serveClient: false,
    pingInterval: 2000
});

io.on('connection', (clientSocket) => {
    console.log(`Client connected with id ${clientSocket.id}`);

    clientSocket.on('disconnect', (reason) => {
        console.log(`Client disconnected with id ${clientSocket.id}, reason: ${reason}`);
    });

    clientSocket.emit('message', 'Welcome to the default namespace!');
});

// Game namespace
const nspGame = io.of('/game');
nspGame.on('connection', (clientSocket) => {
    clientSocket.emit('message', 'Welcome to the /game namespace!');
});

// Chat namespace
const nspChat = io.of('/chat');
nspChat.on('connection', (clientSocket) => {
    clientSocket.emit('message', 'Welcome to the /chat namespace!');

    clientSocket.on('join-room', (roomName) => {
        clientSocket.join(roomName, () => {
            nspChat.to(roomName).emit('message', `
                ${clientSocket.id} has joined ${roomName}
            `);
        });
    });

    clientSocket.on('leave-room', (roomName) => {
        clientSocket.leave(roomName, () => {
            nspChat.to(roomName).emit('message', `
                ${clientSocket.id} has left ${roomName}
            `);
        });
    });

    clientSocket.on('disconnecting', () => {
        Object.keys(clientSocket.rooms).forEach((roomName) => {
            nspChat.to(roomName).emit('message', `${clientSocket.id} has disconnected.`)
        });
    });
});
