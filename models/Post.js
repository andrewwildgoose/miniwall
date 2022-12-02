const { string } = require("joi")
const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    hashtag:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    comments:[
        {
            user:{
                type:String,
                required:true
            },
            text:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                default:Date.now
            }
        }

    ],
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("posts", postSchema)