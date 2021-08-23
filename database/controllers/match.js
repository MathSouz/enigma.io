const { isAuthenticated } = require('../middlewares/auth')
const router = require('express').Router()
const Match = require('../models/match')
const Chat = require('../models/chat')
const User = require('../models/user')

async function isHost(userid, matchid)
{
    const result = await Match.findById(matchid)
    return result && result.host == userid
}

router.delete('/:matchid', isAuthenticated, async (req, res) => {
    
    const { userid } = req.body
    const { matchid } = req.params

    if(isHost(userid, matchid))
    {
        await Chat.deleteMany({ match: matchid })
        const result = await Match.deleteOne({ _id: matchid })
        res.send({ success: result.deletedCount > 0})
    }

    else
    {
        res.send({success: false, result: 'Você não é o mestre da sala.'})
    }
})

router.post('/chat/:matchname/approve/:chatid', isAuthenticated, async (req, res) => {
    const { matchname, chatid } = req.params
    const result = await Match.findOne({ name: matchname })

    if(await isHost(req.body.userid, result._id))
    {
        const chat = await Chat.updateOne({_id: chatid}, {approved: true})
        res.send({ success: chat.nModified > 0})
    }

    else
    {
        res.send({success: false, result: 'Você não é mestre da sala.'})
    }

})

router.post('/chat/:matchname', isAuthenticated, async (req, res) => {
    const { userid, text } = req.body
    const { matchname } = req.params

    try
    {
        const result = await Match.findOne({ name: matchname })

        if(result.players.includes(userid))
        {
            const chat = await Chat.create({ user: userid, match: result._id, text})
            await Match.updateOne({ name: result.name }, {$push: {chat: chat._id}})
            res.send({success: true, result: chat})
        }

        else
        {
            res.send({success: false, result: 'You are not part of this match.'})
        }
    }

    catch(err)
    {
        res.send({success: false, result: err})
    }

})

router.get('/subscribed', isAuthenticated, async (req, res) => 
{
    try
    {
        const fetch = await Match.find({$or: [{'host': req.body.userid}, {'players': req.body.userid}]}).select('+password').sort('-createdAt')
        const result = []

        for(const match of fetch)
        {
            const playersCount = match.players.length
            const hasPassword = !!match.password
            const id = match._id
            const name = match.name
            const date = match.createdAt
            const hostData = await User.findById(match.host)
            const host = hostData.username
            result.push({id, name, hasPassword, playersCount, date, host})
        }

        res.send({success: true, result})
    }

    catch(err)
    {
        res.send({success: false, result: err})
    }
})

router.get('/list', isAuthenticated, async (req, res) => 
{
    try
    {
        const fetch = await Match.find().select('+password').sort('-createdAt')
        const result = []

        for(const match of fetch)
        {
            const playersCount = match.players.length
            const hasPassword = !!match.password
            const id = match._id
            const name = match.name
            const date = match.createdAt
            const hostData = await User.findById(match.host)
            const host = hostData.username
            result.push({id, name, hasPassword, playersCount, date, host})
        }

        res.send({success: true, result})
    }

    catch(err)
    {
        res.send({success: false, result: err})
    }
})

router.put('/join/:matchid', isAuthenticated, async (req, res) => {
    const { matchid } = req.params
    const { password } = req.body

    console.log(password);

    try
    {
        const result = await Match.findById(matchid).select('+password')
        
        if(result)
        {
            if(result.password && result.password != password)
            {
                res.send({success: false, result: 'Wrong password'})
                return
            }

            if(result.host == req.body.userid)
            {
                res.send({success: false, result: "Host can't join as player"})
                return
            }

            const update = await Match.updateOne({ name: result.name }, {$addToSet: {players: req.body.userid}})
            res.send({success: update.nModified > 0})
        }

    }

    catch(err)
    {
        res.send({success: false, result: err})
    }
    
})

router.post('/create', isAuthenticated, async (req, res) => {
    const { userid, name, password, text } = req.body

    try
    {
        const result = await Match.create({name, password, host: userid, text})
        //await Match.updateOne({ name: result.name }, {$addToSet: {players: req.body.userid}})
        result.players = [req.body.userid]
        result.password = undefined
        res.send({success: true, result})
    }

    catch(err)
    {
        res.send({success: false, result: err})
    }
})

module.exports = (app) => {
    app.use('/match', router)
}