require("dotenv").config();
const io = require("socket.io")(process.env.PORT, {
    serveClient: false,
});

io.on("connection", (socket) => {
    /* Attach socket event listeners */
    require("./listeners/connection")(socket);
    require("./listeners/room")(socket, io);
    require("./listeners/game")(socket, io);
});
