module.exports.run = async (bot, message, args) => {

    message.delete()
}

module.exports.help = {
    name: "h"
}

// //plot graph
    // var trace1 = {
    //     x: [1, 2, 3, 4],
    //     y: [1, 15, 13, 17],
    //     type: "scatter"
    // };

    // var trace2 = {
    //     x: [1, 2, 3, 4],
    //     y: [1, 5, 11, 9],
    //     type: 'scatter'
    // };

    // var figure = { 'data': [trace1,trace2] };

    // var imgOpts = {
    //     format: 'png',
    //     width: 468,
    //     height: 351,
    //     autosize: false

    // };

    // plotly.getImage(figure, imgOpts, function (error, imageStream) {
    //     if (error) return console.log(error);

    //     var fileStream = fs.createWriteStream('1.png');
    //     imageStream.pipe(fileStream);
    // });