const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/enigma-io", {useFindAndModify: true, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err)
    {
        console.log(err);
        return
    }

    console.log("Conexão com banco de dados estabelecida.");
})

module.exports = mongoose