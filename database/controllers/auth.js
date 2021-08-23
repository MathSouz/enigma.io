require('dotenv').config()
const router = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.get('/usable/username/:username', async (req, res) => {
    const { username } = req.params

    try
    {
        const result = await User.findOne({username})
        res.send({success: true, result: (!!result) && !username.includes(' ')})
    }

    catch(err)
    {
        res.send({success: false, result: err})
    }
})

router.get('/usable/email/:email', async (req, res) => {
    const { email } = req.params

    
    try
    {
        const result = await User.findOne({email})
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        const canRegister = (!!result) && emailRegex.test(email)
        res.send({success: true, result: canRegister})
    }

    catch(err)
    {
        res.send({success: false, result: err})
    }
})

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body

    try
    {
        const result = await User.create({ username, email, password })
        result.password = undefined
        res.send({success: true, result})
    }

    catch(err)
    {
        res.send({success: false, result: err})
    }
})

router.put('/', async (req, res) => {
    const { email, password } = req.body

    try
    {
        const result = await User.findOne({email}).select('+password')
        const compared = bcrypt.compareSync(password, result.password)

        if(compared)
        {
            const token = jwt.sign({userid: result._id}, process.env.JWT)
            res.send({success: true, result: token})    
        }

        else
        {
            res.send({success: false, result: 'Credenciais inválidas.'})    
        }
    }

    catch(err)
    {
        res.send({success: false, result: 'Email não cadastrado.'})    
    }
})

module.exports = (app) => 
{
    app.use('/auth', router)
}