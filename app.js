// import the libraries
const express = require('express')
const { restart } = require('nodemon')
const app = express()
const mongoose = require('mongoose')

// pointer to the required config file for dotenv package
require('dotenv/config')

// json data parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// creating and assigning the routes to the two main branches of the app.
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')

app.use('/api/posts', postsRoute)
app.use('/api/user', authRoute)


//homepage route
app.get('/', (req,res)=>{
    res.send('Welcome to MiniWall')
})

//database connection
mongoose.connect(process.env.DB_CONNECTER, ()=>{
    console.log('DB is now connected')
})

//start server
app.listen(3000, ()=>{
    console.log('Server is up & running')
})