const Discord = require("discord.js");
const fs = require('fs');
const request = require('request');
var moment = require('moment');

module.exports.run = async (bot, message, args) => {
    payload = {
        'groupCode': "6391aac7eed11e1993aa0e708be4f84f",
        'date': "01/09/2020",
        'meridies': "PM",
        'memberId': 3123767,
        'temperature': "36.1",
        'pin': "2207"
    }
    request.post({url: "https://temptaking.ado.sg/group/MemberSubmitTemperature", form: payload}, function(err,httpResponse,body){ console.log(err,body) })
}

module.exports.help = {
    name: "hi"
}