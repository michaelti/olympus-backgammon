import * as dotenv from "dotenv";
dotenv.config();

import socketIo from "socket.io";
import connection from "./listeners/connection.js";
import room from "./listeners/room.js";
import game from "./listeners/game.js";

const io = socketIo(process.env.PORT, {
    serveClient: false,
    pingInterval: 5000,
});

io.on("connection", (socket) => {
    /* Attach socket event listeners */
    connection(socket, io);
    room(socket, io);
    game(socket, io);
});
