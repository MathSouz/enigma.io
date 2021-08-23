require('dotenv').config()
const jwt = require('jsonwebtoken')

exports.isAuthenticated = (req, res, next) => {
    const { authorization } = req.headers
    
    if(!authorization)
    {
        res.send({success: false, result: 'No Token.'})
        return
    }

    const split = authorization.split(" ")

    if(split[0] != 'Bearer' || split[1] == '')
    {
        res.send({success: false, result: 'Malformed Token.'})
        return
    }

    try
    {
        const token = jwt.verify(split[1], process.env.JWT)
        req.body.userid = token.userid
        next()
    }

    catch(err)
    {
        res.send({success: false, result: 'Invalid Token'})
    }
}