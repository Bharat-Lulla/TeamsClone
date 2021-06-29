const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookies = require('cookie-parser');

const app = express();

//This server allows us to create
const server = require("http").Server(app);
//we need to pass server at the return of the require funtion what is does it passes the server to the socket based on our express server
// so that socket knows on which server i need to interact

const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});


app.use("/peerjs", peerServer);
app.use(cookies());

app.set("view engine", "ejs");
app.use(express.static("public"));

const auth = require("./routes/api/auth");
const home = require('./routes/api/home');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const Person = require('./models/Person');
const Room = require("./models/Room");

//actual routes
app.use('/api/auth',auth);
app.use('/api/home',home);

app.get("/", (req, res) => {
  // res.redirect(`/${uuidV4()}`);
  res.redirect('/api/auth/login');
});

app.get("/:room", (req, res) => {
  
  token = req.cookies['token'];

  jwt.verify(token, process.env.secret, (err, user) => {
    if (!err) {
      Person.findById( user.id )
        .then((profile) => {
          if (!profile) {
            return res
              .status(404)
              .json({ profilenotfound: "no profile found" });
          }
          else{
            Room.findOne({roomId: req.params.room}).then((room)=>{
              res.render("room", { roomId: req.params.room, username:profile.username, chats:room.chats});
            })
            
          }

          
        })
        .catch((err) => console.log("Got some error in profile " + err));
    } else {
      return res.status(403).json({ message: "User not authorised" });
    }
  });
});

//this will run every time when one user connects to our room
io.on("connection", (socket) => {

  // socket.setTimeout(3000);
  //this will be called from user side as when user joins it will send this key join-room and 2 parameters
  socket.on("join-room", (roomId, userId) => {
    // this will join the current user to the room id
    socket.join(roomId);
    // now we need broadcast to other user that user is connected and what it does it will not send message back to current user as he or she that i am connected
    // this is the old syntax because using older version of socket just make sure if you update to change here the new syntax of broadcast
    socket.to(roomId).broadcast.emit("user-connected", userId);
    // messages
    socket.on("message", (message) => {
      //send message to the same room
      // Room.findAndModify({ roomId: roomid},{ $push: { chates: message }}) updating chats array
      Room.findOne({ roomId: roomId}, function(err, foundRoom){
        foundRoom.chats.push(message);
        foundRoom.save();
      });
      io.to(roomId).emit("createMessage", message);
    });

    //this is used when user disconnect from server so we broadcast the msg to all other user that user disconnected and we will remove its video element
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(process.env.PORT || 3000);
