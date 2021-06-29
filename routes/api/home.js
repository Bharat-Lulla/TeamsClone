require('dotenv').config();
const express = require("express");
const router = express.Router();
//this will generate unique room id whenever system starts
const { v4: uuidV4 } = require("uuid");

router.use(express.static('public'));

//Room schema
const Room = require("../../models/Room");

router.get("/",(req,res)=>{
    res.render('home');
})

router.post('/create',(req,res)=>{
    const roomid = uuidV4();
    Room.findOne({ roomId: roomid })
    .then((room) => {
      if (room) {
        return res.status(400).json({ Invalid: "Sorry for inconvenience but created rommid already exists please try again" });
      } else {
        const newRoom = new Room({
            roomId: roomid,
          });
          newRoom.save().then((room)=>{
            res.redirect(`/${roomid}`);
          })
      }
    }).catch((err) => console.log(err));

    
})

router.post('/join',(req,res)=>{
    const roomid = req.body.roomid;
    Room.findOne({ roomId: roomid})
    .then((room) => {
      if (room) {
        res.redirect(`/${roomid}`);
      } else {
        return res.status(400).json({ Invalid: "No room found please enter correct room id or create one" });
      }
    }).catch((err) => console.log(err));
    
})
module.exports = router;