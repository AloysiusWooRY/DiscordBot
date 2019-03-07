module.exports.run = async (bot, message, args) => {
    message.channel.send({embed: {
        color: 16711680,
        title: "APEX Role",
        description: "React with ✅ below to unlock dedicated APEX channels.\n" +
                     "Features: Expansions, Release Dates, Balance Changes, and more!\n" +
                     "Channels: [<#553068090133315584>] & [<#544900181913632778>]"
      }
    }).then((msg) => {
        msg.react("✅");
        delete message;
    });
}

module.exports.help = {
    name: "edit"
}