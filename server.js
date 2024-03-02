const { App } = require("uWebSockets.js");
const { Server } = require("socket.io");
const uws = new App();
const express = require("express")
const application = express();
const io = new Server({
  cors: {
    origin: "0.0.0.1:3000",
    methods: ["GET", "POST"]
  }
});
io.attachApp(uws);
// every socket is an a room that is their id
io.on("connection", (socket)=>{
  console.log(`new connection with id : ${socket.id}`);

  socket.on("initialize", (message, room)=>{
    console.log(message);
    socket.join(room);
    io.to(room).emit("receive-message", message)
  });

  socket.on("user-offline", (message)=>{
    console.log(message);
  });

  socket.on("chat", (message, room)=>{
    console.log(message);
    io.to(room).emit("receive-message", message);
  });
})

application.use(express.static("dist"));

uws.listen(3000, (token) => {
    
  if (!token) {
    console.warn("port already in use");
  }
  else{
    console.log("websocket server listening on port 3000")
  }
});


application.listen(80, ()=>{
  console.log("express server listening on port 80");
})
