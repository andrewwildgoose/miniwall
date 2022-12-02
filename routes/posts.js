const express = require('express')
const router = express.Router()

//data schema
const Post = require('../models/post')

// token verification
const verifyToken = require('../verifyToken')

//POST receive post data and send to database
router.post('/', verifyToken, async(req,res)=>{
    const postData = new Post({
        user:req.body.user,
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

//GET get all posts back to view
router.get('/', verifyToken, async(req,res)=>{
    try{
        const getPosts = await Post.find()
        res.send(getPosts)
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
    const postData = new Post({
        user:req.body.user,
        title:req.body.title,
        text:req.body.text,
        hashtag:req.body.hashtag,
        location:req.body.location
    })
    try{
        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                user:req.body.user,
                title:req.body.title,
                text:req.body.text,
                hashtag:req.body.hashtag,
                location:req.body.location
                }
            })
        res.send(updatePostById)     
    }catch(err){
        res.send({message:err})
    }
})


module.exports = router