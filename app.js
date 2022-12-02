//import the libraries
const express = require('express')
const { restart } = require('nodemon')
const app = express()
const mongoose = require('mongoose')

require('dotenv/config')

//json data parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')

app.use('/api/posts', postsRoute)
app.use('/api/user', authRoute)

//homepage route
app.get('/', (req,res)=>{
    res.send('You are in your homepage')
})

//database connection
mongoose.connect(process.env.DB_CONNECTER, ()=>{
    console.log('DB is now connected')
})

//start server
app.listen(3000, ()=>{
    console.log('Server is up & running')
})