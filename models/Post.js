// import database package, type definitions and User data schema  
const { string, bool } = require("joi")
const mongoose = require("mongoose")
const User = require("./User")

// Schema defining data model of a Post
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
    likeIDs:[
        String
    ],
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
    },
    updated:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("posts", postSchema)