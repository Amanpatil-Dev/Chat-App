const http = require("http");
const express = require("express");
const app = express();
const socketio = require("socket.io");
const profane = require('bad-words')

//Core modules
const { GenerateMessage } = require('../src/utils/messages')
const { GenerateLocationMessage } = require('../src/utils/messages')
const { addUser, removeUser, getUser, getUserIndex } = require('./utils/users')

//Creating server
const server = http.createServer(app);
const io = socketio(server);

//Getting set Template
const path = require("path");
const PublicPath = path.join(__dirname, "../public");
app.use(express.static(PublicPath));

let count = 0;
const message = "Welcome User";

//Server to client
// server(emits) => client(reciever) = CountUpdate

// Client to server
// client(emits) => server(reciever) = inc



//RUN WHEN A CLIENT CONNECTS
io.on("connection", (socket) => {
  console.log("connected");

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room })

    if (error) {
      return callback('Cannot join')

    }
    socket.join(user.room)
    //socket.emit when you have to send it to yourself or the user that connects
    socket.emit("Welcome", GenerateMessage('Admin', 'Welcome'));
    //socket.broadcast when you have to send a mesage to evevYrone but yourself

    //socket.emit, io.emit, socket.broadcast.emit
    //socket.emit, io.to.emit, socket.broadcast.to.emit
    socket.broadcast.to(user.room).emit("Welcome", GenerateMessage('Admin', `${user.username} Has Joined`))

    io.to(user.room).emit('roomdata', {
      room: user.room,
      users: getUserIndex(user.room)
    })

    callback()


  })


  //RUNS SEND location
  socket.on('sendLocation', (coordinates, callback) => {
    const user = getUser(socket.id)
    console.log(user.username)
    //Achknowledgement function recieved ==>CALLBACK()
    const { latitude, longitude } = coordinates
    const linkLoc = `https://google.com/maps?q=${latitude},${longitude}`

    io.to(user.room).emit("LocationMessage", GenerateLocationMessage(user.username, linkLoc))
    callback()
  })

  socket.on("CliMessage", (val, callback) => {
    const user = getUser(socket.id)

    console.log('this is', user)

    const filter = new profane()

    if (filter.isProfane(val)) {
      return callback('Profane found cannot deliver your message')
    }
    //io.emit when you have to send it to everyone in the group
    io.to(user.room).emit("Welcome", GenerateMessage(user.username, val));
    callback()
  });

  //RUNS When user disconnects
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    // console.log(user)
    // console.log(user.room)

    if (user) {
      io.to(user.room).emit("Welcome", GenerateMessage('Admin', `${user.username} Has Left`))
      io.to(user.room).emit('roomdata', {
        room: user.room,
        users: getUserIndex(user.room)
      })
    }


  })

  //   socket.emit("UpdatedCount", count);

  //   socket.on("inc", () => {
  //     count++;
  //socket.emit('UpdatedCount',count)

  //for multiple users on different machine
  //   io.emit("UpdatedCount", count);

  //   });
});



server.listen(3000, () => {
  console.log("app is up and Running on port 3000");
});
