const Discord = require("discord.js");

const fs = require('fs');


module.exports.run = async (bot, message, args) => {

    message.delete().then(
        message.channel.fetchMessages({limit:1}).then(msg => {

            let jsonArr = msg.filter(x => x.content.startsWith("{")).map(x => JSON.parse(x.content))
            console.log(jsonArr)

            let d = new Date()
            let currentDay = d.getDate()
            let currentHour = d.getHours()

            let currentArr = jsonArr.find(a => a.hour == currentHour)
            if(currentArr["day"] != currentDay){

            }
        })
    )
        
}

module.exports.help = {
    name: "hi"
}


//plot graph
    // var trace1 = {
    //     x: [1, 2, 3, 4],
    //     y: [10, 15, 13, 17],
    //     type: "scatter"
    //   };

    //   var figure = { 'data': [trace1] };

    //   var imgOpts = {
    //       format: 'png',
    //       width: 1000,
    //       height: 500
    //   };

    //   plotly.getImage(figure, imgOpts, function (error, imageStream) {
    //       if (error) return console.log (error);

    //       var fileStream = fs.createWriteStream('1.png');
    //       imageStream.pipe(fileStream);
    //   });


//get data for graph
// message.channel.fetchMessages().then(msg => {

//     let jsonArr = msg.filter(x => x.content.startsWith("{")).map(x => JSON.parse(x.content))
//     console.log(jsonArr)

//     let d = new Date()
//     let currentDay = d.getDate()
//     let currentHour = d.getHours()

//     let currentArr = jsonArr.find(a => a.hour == currentHour)
//     if(currentArr["day"] != currentDay){

//     }
// })