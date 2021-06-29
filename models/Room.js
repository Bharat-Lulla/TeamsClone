const mongoose= require('mongoose')
const Schema= mongoose.Schema

const RoomSchema = new Schema({
    roomId: {
        type: String,
        require: true
    },
    chats: [{
        type:String
    }]
})

module.exports = Room = mongoose.model("myRoom", RoomSchema);