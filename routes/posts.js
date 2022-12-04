// import packages
const express = require('express')
const router = express.Router()
const jsonwebtoken = require('jsonwebtoken')

//data schemas
const Post = require('../models/post')
const User = require('../models/User')

// pointer to token verification process
const verifyToken = require('../verifyToken')

//POST receive post data and send to database
router.post('/new', verifyToken, async(req,res)=>{
    // find user making the action
    const decoded = jsonwebtoken.verify(req.header('auth-token'), process.env.TOKEN_SECRET);  
    var userId = decoded._id  
    const user = await User.findById(userId)
    
    // capture and save the post data
    const postData = new Post({
        user:user.username,
        title:req.body.title,
        text:req.body.text,
        hashtag:req.body.hashtag,
        location:req.body.location
    })
    try{
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.send({message:err})
    }
    
})

//GET sort and get all posts back to view
router.get('/', verifyToken, async(req,res)=>{
    try{
        const getPosts = await Post.find()
        const sortedPosts = getPosts.sort((a, b) => {
            if (a.likes === b.likes){
                return a.date > b.date ? 1 : -1
            }
            return parseFloat(b.likes) - parseFloat(a.likes)
        })
        res.send(sortedPosts)
    }catch(err){
        res.send({message:err})
    }
})

//GET specific post back to view
router.get('/:postId', verifyToken, async(req,res)=>{
    try{
        const getPostById = await Post.findById(req.params.postId)
        res.send(getPostById)
    }catch(err){
        res.send({message:err})
    }
})

//PATCH update a post
router.patch('/:postId', verifyToken, async(req,res)=>{
    // find user making the action
    const decoded = jsonwebtoken.verify(req.header('auth-token'), process.env.TOKEN_SECRET);  
    var userId = decoded._id  
    const user = await User.findById(userId)

    // find the root post that is being updated
    const rootPost = await Post.findById({_id:req.params.postId})

    // check for user trying to update a post they didn't make 
    if (user.username != rootPost.user){
        return res.status(401).send({message:'you cannot edit a post you did not create'})
    }
    // update specified fields of the post and mark the post as modified from the original
    try{
        const updatePostById = await Post.updateOne(
            {_id:rootPost},
            {$set:{
                user:user.username,
                title:req.body.title,
                text:req.body.text,
                hashtag:req.body.hashtag,
                location:req.body.location,
                updated:true
                }
            })
        res.send(updatePostById)     
    }catch(err){
        res.send({message:err})
    }
})

//PATCH add a comment to a post
router.patch('/:postId/comment', verifyToken, async(req,res)=>{
    // find user making the action
    const decoded = jsonwebtoken.verify(req.header('auth-token'), process.env.TOKEN_SECRET);  
    var userId = decoded._id  
    const user = await User.findById(userId)
    
    // find the root post that is being commented on
    const rootPost = await Post.findById({_id:req.params.postId})

    // check for user trying to comment on their own post 
    if (user.username === rootPost.user){
        return res.status(401).send({message:'you cannot comment on your own post'})
    }
    // add comment text and username to the comments array within the Post
    try{
        const addComment = await Post.updateOne(
            {_id:rootPost},
            {$push:{
                comments: {user:user.username, text:req.body.text}
                }
            })
        res.send(addComment)     
    }catch(err){
        res.send({message:err})
    }
})

//PATCH add a like to a post
router.patch('/:postId/like', verifyToken, async(req,res)=>{
    // find user making the action
    const decoded = jsonwebtoken.verify(req.header('auth-token'), process.env.TOKEN_SECRET);  
    var userId = decoded._id  
    const user = await User.findById(userId)
    
    // find the root post that is being liked
    const rootPost = await Post.findById({_id:req.params.postId})

    // check for user trying to like their own post 
    if (user.username === rootPost.user){
        return res.status(401).send({message:'you cannot like your own post'})
    }

    // check for user trying to like a post more than once
    if (rootPost.likeIDs.includes(user.id)){
        return res.status(401).send({message:'you already liked this post'})
    }
    // increment like count by 1 and add user ID to record
    try{
        const addLike = await Post.updateOne(
            {_id:rootPost},
            {$inc:{
                likes:1
                },
            $push:{
                likeIDs:user.id
                }
            }
        )
        res.send(addLike)     
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router