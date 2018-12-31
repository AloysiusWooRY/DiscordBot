module.exports.run = async (bot, message, args) => {
    console.log(1)
    message.channel.send({embed: {
        color: 255,
        title: "Fornite Role",
        description: "React with ✅ below to unlock dedicated Fortnite channels.\n" +
                     "Features: Expansions, Release Dates, Balance Changes, and more!\n" +
                     "Channels: [<#509275778261712906>] & [<#509278429196320769>]"
      }
    }).then((msg) => {
        msg.react("✅");
        delete message;
    });

    message.channel.send({embed: {
        color: 16777215,
        title: "Overwatch Role",
        description: "React with ✅ below to unlock dedicated Overwatch channels.\n" +
                     "Features: Expansions, Release Dates, Balance Changes, and more!\n" +
                     "Channels: [<#508997643955863563>] & [<#509278395142766602>]"
      }
    }).then((msg) => {
        msg.react("✅");
        delete message;
    });

    message.channel.send({embed: {
        color: 16776960,
        title: "Hearthstone Role",
        description: "React with ✅ below to unlock dedicated Hearthstone channels.\n" +
                     "Features: Expansions, Release Dates, Balance Changes, and more!\n" +
                     "Channels: [<#508997675165941761>] & [<#509278356295122945>]"
      }
    }).then((msg) => {
        msg.react("✅");
        delete message;
    });
    
}

module.exports.help = {
    name: "embed"
}


