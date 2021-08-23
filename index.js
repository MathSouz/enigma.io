const express = require('express')
const app = express()
const http = require('http').createServer(app)
const cors = require('cors')
const { isAuthenticated } = require('./database/middlewares/auth')
const io = require('socket.io')(http)
require('./database/index')

const users = []

io.on('connection', (socket) => {
    socket.on('greeting', (userid) => {
        users.push({
            socketId: socket.id,
            userId: userid
        })
        console.log(userid);
    })

    socket.on('disconnect', () => {
        console.log(socket.id + " disconnected");
    })
})

app.use(express.json())
app.use(cors({
    origin: '*'
}))

app.get("/test", (req, res) => {
    res.send({success: true, date: new Date()})
})

app.get("/", isAuthenticated, (req, res) => {
    res.send({success: true, date: new Date(), userid: req.body.userid})
})

require('./database/controllers/auth')(app)
require('./database/controllers/match')(app)

http.listen(4000, () => {
    console.log("Server's on!");
})