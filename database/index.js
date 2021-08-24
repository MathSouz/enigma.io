require('dotenv').config()
const mongoose = require('mongoose')

console.log("Estabelecendo conexão com o banco de dados...");
mongoose.connect(process.env.DB_HOST, {useFindAndModify: true, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err)
    {
        console.log(err);
        return
    }

    console.log("Conexão com banco de dados estabelecida.");
})

module.exports = mongoose