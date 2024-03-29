var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const {joinUser, removeUser, findUser} = require('./user');
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
let thisRoom = "";
io.on("connection", function (socket) {
  console.log("connected");
  socket.on("join room", (data) => {
    console.log('in room');
    let Newuser = joinUser(socket.id, data.username,data.roomName)
    //io.to(Newuser.roomname).emit('send data' , {username : Newuser.username,roomname : Newuser.roomname, id : socket.id})
   // io.to(socket.id).emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
   socket.emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
   
    thisRoom = Newuser.roomname;
    console.log(Newuser);
    socket.join(Newuser.roomname);
  });
  socket.on("chat message", (data) => {
    io.to(data.roomName).emit("chat message", {data:data,id : socket.id});
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    if(user) {
      console.log(user.username + ' has left');
    }
    console.log("disconnected");

  });
});

http.listen(3000, function () {});