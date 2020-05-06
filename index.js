const io = require('socket.io')();

io.on('connection', (client) => {
    console.log('Client connected.');
});

io.listen(process.env.PORT);
