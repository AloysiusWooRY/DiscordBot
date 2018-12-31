const Discord = require("discord.js")
const mongoose = require("mongoose");
mongoose.connect("mongodb://Alloy:Aa220799@ds036617.mlab.com:36617/life");
const Foods = require("../models/food.js");


module.exports.run = async (bot, message, args) => {

    switch(args[0]){
        case "add":
            const request = new Request({
                _id: mongoose.Types.ObjectId(),
                username: message.author.username,
                userID: message.author.id,
                text: args[1],
                time: message.createdAt
            });
            
    
            request.save()
                .then(result => console.log(result))
                .catch(err => console.log("err:" + err))

            break;

        case "change":
            Request.find({}, (err, docs) => {
                if (err) console.log(err)
                console.log(docs[0].text)
            })
            break;
            
        case "get":
            let arrayFood = [];
            let chosen = "";
    
            Foods.find({}, (err, f) => {
                if (err) return console.log(err)
    
                for (let j = 0; j < f.length; j++) {
                    let count = f[j].count;
                    for (let i = 0; i < count; i++) {
                        arrayFood.push(f[j].food)
                    }
                }
                chosen = arrayFood[Math.floor(Math.random() * arrayFood.length)];
            })
            
            break;
    }
    
}

module.exports.help = {
    name: "mongo"
}



function getFood(){

    let arrayFood = [];
    let chosen = "";

    Foods.find({}, (err, f) => {
        if (err) return console.log(err)

        for (let j = 0; j < f.length; j++) {
            let count = f[j].count;
            for (let i = 0; i < count; i++) {
                arrayFood.push(f[j].food)
            }
        }
        chosen = arrayFood[Math.floor(Math.random() * arrayFood.length)];      
    })

}