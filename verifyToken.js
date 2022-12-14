// import jwt package
const jsonwebtoken = require('jsonwebtoken')

// define function to use jwt across all endpoints of the API
function auth(req,res,next){
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send({message:'access denied'})
    }
    try{
        const verified = jsonwebtoken.verify(token,process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }catch(err){
        return res.status(401).send({message:'invalid token'})
    }
}

module.exports = auth