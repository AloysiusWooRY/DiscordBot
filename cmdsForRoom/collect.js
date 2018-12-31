module.exports.run = async (bot, message, args) => {

    let msg = await message.channel.send("hi");
    msg.react('😄')
    console.log(msg.reactions)
    // message.channel.fetchMessage("509310794807377920") //509001343835570176
    // .then(message1 => console.log(message1))

    console.log("done")
}

module.exports.help = {
    name: "collect"
}

    //     bot.channels.find("id","508997879143202826").fetchMessage({around: "509001343835570176", limit: 1})
    //         .then(messages => {
    //             const fetchMessage = messages.first();
    //             console.log(messages)
    //         })
    //     // const reactions = msg.awaitReactions(reaction => reaction.emoji.name === "✅", {time: 1000});
    //     // let arr = reactions.get("✅").users.map(g => g.id).filter(h => h != "444835244043010058") || [];
    //     // console.log(arr)