module.exports.chatSockets = function (socketServer) {
    let io = require('socket.io')(socketServer, {
        cors: {
            origin: '*'
        }
    });


    io.sockets.on('connection', function (socket) {
        console.log('new Connection received', socket.id);


        socket.on('disconnect', function () {
            console.log('Disconnected');
        });

        socket.on('join_room', function (data) {
            console.log('joining request received', data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send_message', function (data) {
            // console.log('data received in back end', data);
            let date = new Date();
            data.sentTime = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
            io.in(data.chatroom).emit('msg_rcvd', data);
        });


    });

}