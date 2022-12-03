const express = require('express')
const router = express.Router()

const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

// user registration process and checks
router.post('/register', async(req,res)=>{

    // Validation 1. to check user input
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2. to check if email already in use
    const emailExists = await User.findOne({email:req.body.email})
    if (emailExists){
        return res.status(400).send({message:'email already in use'})
    }

    // Validation 3. to check if username already in use
    const usernameExists = await User.findOne({username:req.body.username})
    if (usernameExists){
        return res.status(400).send({message:'username already in use'})
    }

    // hash user password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // Insert user data to db
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })
    try{
        const savedUser = await user.save()
    res.send(savedUser)
    }catch(err){
        res.status(400).send({message:err})
    }
    
})

// user login process and checks
router.post('/login', async(req,res)=>{
    // Validation 1. to check user input
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }
    
    // Validation 2. check user exists
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send({message:'user does not exist'})
    }

    // Validation 3. check user password
    const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
    if(!passwordValidation){
        return res.status(400).send({message: "password is incorrect"})
    }
    
    // Generate auth tokens for successful log in
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token',token).send({'auth-token':token})

})

module.exports = router