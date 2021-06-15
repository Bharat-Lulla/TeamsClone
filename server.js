const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())

//This server allows us to create 
const server = require('http').Server(app)
//we need to pass server at the return of the require funtion what is does it passes the server to the socket based on our express server 
// so that socket knows on which server i need to interact

const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
//this will generate unique room id whenever system starts 
const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

//this will run every time when one user connects to our room
io.on('connection', socket => {
  //this will be called from user side as when user joins it will send this key join-room and 2 parameters
  socket.on('join-room', (roomId, userId) => {
    // this will join the current user to the room id 
    socket.join(roomId)
    // now we need broadcast to other user that user is connected and what it does it will not send message back to current user as he or she that i am connected
    // this is the old syntax because using older version of socket just make sure if you update to change here the new syntax of broadcast
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)

      //this is used when user disconnect from server so we broadcast the msg to all other user that user disconnected and we will revove his or her video from our server
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  }); 

   
  })
})

server.listen(process.env.PORT||3000)
