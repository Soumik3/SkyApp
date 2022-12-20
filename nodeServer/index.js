//Node Server which will handel socket id connetions


const io = require('socket.io')(8000);

const users = {};

// 36 minute
//io.on is a socket instance,it will listen all 
// socket connection like who is connected
//socket.on will focus on particular socket event
//it will accept or listen an event like new-user-joined,then it will run the 
// callback function like name,message
io.on("connection", (socket) => {
    //each socket have its own socket id

    //if any new user joins,let others connected to the server know
    socket.on('new-user-joined', (name) => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        //it will trigger an event named - user-joined
        //it will let all other user know that new user joined expect new user
    });

    //if someone sends a message,broadcast it to other people
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    })
    //listen an event and then run the callback function
    //if someone leaves the chat,let other people know
    socket.on('disconnect', (message) => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id]
    })
})