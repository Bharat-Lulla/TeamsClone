require('dotenv').config();
const express = require("express");
const router = express.Router();
//this will generate unique room id whenever system starts
const { v4: uuidV4 } = require("uuid");

router.use(express.static('public'));

router.get("/",(req,res)=>{
    res.render('home');
})

router.post('/create',(req,res)=>{
    res.redirect(`/${uuidV4()}`);
})

router.post('/join',(req,res)=>{
    const roomid = req.body.roomid;
    res.redirect(`/${roomid}`);
})
module.exports = router;