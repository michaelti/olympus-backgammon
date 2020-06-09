const io = require('socket.io')(process.env.PORT, {
    serveClient: false,
});
const clone = require('ramda.clone');
const plakoto = require('./plakoto.js');
const util = require('./util.js');

io.on('connection', (socket) => {
    let board = plakoto.Board();
    let submoves = new Array();
    board.initPlakoto();
    let boardBackup = clone(board);
    socket.emit('game/update-board', board);

    // Client event: start room
    socket.on('event/start-room', () => {
        // Generate a random room name string
        const roomName = util.randomAlphanumeric(6);

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

    socket.on('game/submove', (from, to, callback) => {
        if (board.trySubmove(from, to)) {
            submoves.push(plakoto.Submove(from, to));
        }
        callback(board);
    });

    socket.on('game/apply-turn', (callback) => {
        /* Validate the whole turn by passing the array of submoves to a method
         * If the move is valid, end the player's turn
         * Else, return an error and undo the partial move
        */
        if (boardBackup.isTurnValid(submoves)) {
            board.turn = board.otherPlayer();
            board.rollDice();
            boardBackup = clone(board);
        }
        else {
            board = clone(boardBackup);
        }
        submoves = [];
        callback(board);
    });

    socket.on('game/undo', (callback) => {
        submoves = [];
        board = clone(boardBackup);
        callback(board);
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
