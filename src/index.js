require("dotenv").config();
const io = require("socket.io")(process.env.PORT, {
    serveClient: false,
    pingInterval: 5000,
});

io.on("connection", (socket) => {
    /* Attach socket event listeners */
    require("./listeners/connection")(socket, io);
    require("./listeners/room")(socket, io);
    require("./listeners/game")(socket, io);
});
