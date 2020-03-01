const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let tesxt = '{ "crypto": [5,4,3,2,1], "time":5}'

    var obj = JSON.parse(tesxt);
    console.log(obj)
}

module.exports.help = {
    name: "hi"
}