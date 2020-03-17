const Discord = require("discord.js");
const fs = require('fs');
const rp = require('request-promise');
const prefix = "!" || botSettings.prefix;
const bot = new Discord.Client({});
const exclamationJSON = require('./exclamation.json');
const herokuTokens = [process.env.crypt,process.env.plotlyKey,process.env.token]
const plotly = require('plotly')("Alloy", herokuTokens[1])
bot.commands = new Discord.Collection();

fs.readdir("./cmdsForRoom/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${jsfiles.length} commands!`);

    jsfiles.forEach((f, i) => {
        let props = require(`./cmdsForRoom/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("message", async message => {
    if (message.author.bot) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(bot, message, args);
})

bot.on("ready", async () => {
    console.log(`Bot is ready! ${bot.user.username}`);

    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch (e) {
        console.log(e.stack);
    }

    cryptoMax()

});


const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = bot.users.get(data.user_id);
    const channel = bot.channels.get(data.channel_id) || await user.createDM();

    if (channel.messages.has(data.message_id)) return;

    const message = await channel.fetchMessage(data.message_id);
    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        const emoji = new Discord.Emoji(bot.guilds.get(data.guild_id), data.emoji);
        reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === bot.user.id);
    }

    bot.emit(events[event.t], reaction, user);

})

let reactRoles = {
    roleMember: "529234619753562122",
    roleFornite: "529233484179439618",
    roleOverwatch: "529233965962493972",
    roleHearthstone: "529233552546594816",
    roleApex: "553067897619087370",
    roleKpop: "529234075177975808"
};

let reactMessage = {
    msgMember: "529241509841862656",
    msgFornite: "529243049348300820",
    msgOverwatch: "529243050484957205",
    msgHearthstone: "529243051575738380",
    msgApex: "553069057625030659",
    msgKpop: "529243052963921931"

};

bot.on('messageReactionAdd', (reaction, user) => {

    let rMsg = reaction.message.id;
    let msgCheck = rMsg == reactMessage.msgMember ? "roleMember" :
        rMsg == reactMessage.msgKpop ? "roleKpop" :
            rMsg == reactMessage.msgOverwatch ? "roleOverwatch" :
                rMsg == reactMessage.msgHearthstone ? "roleHearthstone" :
                    rMsg == reactMessage.msgFornite ? "roleFornite" :
                        rMsg == reactMessage.msgApex ? "roleApex" :
                            null;

    if (!msgCheck) return
    let member = bot.guilds.find(x => x.id === "322271623543783424").members.get(user.id);
    let roleF = member.roles.has(reactRoles[msgCheck])

    if (!roleF) {
        member.addRole(reactRoles[msgCheck]).catch(console.error);
    }

});

bot.on('messageReactionRemove', (reaction, user) => {

    let rMsg = reaction.message.id;
    let msgCheck = rMsg == reactMessage.msgMember ? "roleMember" :
        rMsg == reactMessage.msgKpop ? "roleKpop" :
            rMsg == reactMessage.msgOverwatch ? "roleOverwatch" :
                rMsg == reactMessage.msgHearthstone ? "roleHearthstone" :
                    rMsg == reactMessage.msgFornite ? "roleFornite" :
                        rMsg == reactMessage.msgApex ? "roleApex" :
                            null;

    if (!msgCheck) return
    let member = bot.guilds.find(x => x.id === "322271623543783424").members.get(user.id);
    let roleF = member.roles.has(reactRoles[msgCheck])

    if (roleF) {
        member.removeRole(reactRoles[msgCheck]).catch(console.error);
    }

});

const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
        'start': '1',
        'limit': '200',
        'convert': 'SGD'
    },
    headers: {
        'X-CMC_PRO_API_KEY': herokuTokens[0]
    },
    json: true,
};

function cryptoMax() {

    let guildCrypto = bot.guilds.find(x => x.name === "Eh lai")
    let channelCrypto = guildCrypto.channels.find(x => x.name === "infopanel")
    let channelData = guildCrypto.channels.find(x => x.name === "data")
    let roleCrypto = guildCrypto.roles.find(y => y.name === "Crypto");
    guildCrypto.channels.find(x => x.name === "configs").fetchMessage('683537412592369664').then(configMsg => {

        let parseJson = JSON.parse(configMsg.content)
        let cryptoArr = parseJson.crypto
        let timeSet = parseJson.time * 60 * 1000
        let thresholdNum = parseJson.threshold


        rp(requestOptions).then(response => {

            module.exports.responseSave = response
            let fieldText = ''
            let outstandingText = ''
            let notiArr = []
            let dataObj = {}

            for (x of cryptoArr) {
                let cryptoQuote = response.data.filter(d => d.symbol == x)[0].quote.SGD
                let quotePrice = cryptoQuote.price.toFixed(2).padStart(8, " ")
                let quotePercentChg = cryptoQuote.percent_change_24h.toFixed(2).padStart(5, " ")

                if (quotePercentChg >= (1*thresholdNum) || quotePercentChg <= (-1 * thresholdNum)) {
                    //let randomEx = exclamationJSON.exclamation[Math.floor(Math.random() * exclamationJSON.exclamation.length)]
                    outstandingText += `${x}: ${quotePrice} (${quotePercentChg}%)\n`
                    notiArr.push(`${x}: ${quotePrice} (${quotePercentChg}%)`)
                }
                else {
                    fieldText += `${x}: ${quotePrice} (${quotePercentChg}%)\n`
                }
                dataObj[x] = quotePrice.trim()
            }

            const Embed = new Discord.RichEmbed()
                .setTitle('__Crypto Listings__')
                .setColor('#00ff00')
                .setTimestamp()
                .setFooter('All prices in SGD');

            if (fieldText) {
                Embed.setDescription('```' + fieldText + '```')
            }
            if (outstandingText) {
                Embed.addField('⠀', `__*Outstanding(+-${thresholdNum}%)*__` + '```' + outstandingText + '```', true)
                Embed.setColor('#ff0000')
            }

            //Push to UI
            channelCrypto.fetchMessages().then(msgs => {
                channelCrypto.bulkDelete(msgs)
            })

            channelData.send(JSON.stringify(dataObj))

            let now = new Date()
            let yesterday = now.getTime() - 86400000

            lots_of_messages_getter(channelData, 300).then(msgs => {
                let timeArr = msgs.filter(x => x.content.startsWith("{")).map(x => {
                    if (x.createdTimestamp >= yesterday) {
                        let d = new Date(x.createdTimestamp);
                        d.setHours(d.getHours() + 8)
                        return d
                    }
                })
                let valueArr = msgs.filter(x => x.content.startsWith("{")).map(y => JSON.parse(y.content))

                guildCrypto.channels.find(x => x.name === "configs").fetchMessage('683537412592369664').then(configMsg => {

                    for (let i = 0; i < cryptoArr.length; i++) {
                        let targetedCrypto = []
                        for (y of valueArr) {
                            targetedCrypto.push(y[cryptoArr[i]])
                        }
                        var trace1 = {
                            x: timeArr,
                            y: targetedCrypto,
                            type: "scatter"
                        };

                        var figure = { 'data': [trace1] };

                        var imgOpts = {
                            format: 'png',
                            width: 550,
                            height: 250,
                        };

                        const templateEmbed = {
                            color: 0xffffff,
                            title: cryptoArr[i].toUpperCase(),
                            image: {
                                url: `attachment://${i}.png`
                            }
                        }

                        channelCrypto.send({ files: [`./${i}.png`], embed: templateEmbed }).then(() => {
                            if (i == 0) {
                                channelCrypto.send(Embed)
                                if (notiArr.length > 0) {

                                    let now = new Date()
                                    let cd = parseJson.cd
                                    let cdTimestamp = parseJson.cdTimestamp

                                    if (now.getTime() > (cdTimestamp + cd * 60 * 1000)) {
                                        channelCrypto.send("[ALERT]\n" + notiArr.join('\n') + ' ' + roleCrypto)
                                        parseJson.cdTimestamp = now.getTime()
                                        configMsg.edit(JSON.stringify(parseJson))
                                    }
                                }
                            }
                        })

                        plotly.getImage(figure, imgOpts, function (error, imageStream) {
                            if (error) return console.log(error);

                            var fileStream = fs.createWriteStream(`${i}.png`);
                            imageStream.pipe(fileStream);
                        });
                    }
                })
            }).catch((err) => {
                console.log('Get all error:', err.message);
            });



        }).catch((err) => {
            console.log('API call error:', err.message);
        });
        resety(timeSet)
    })
}

async function lots_of_messages_getter(channel, limit = 300) {
    const sum_messages = [];
    let last_id;

    while (true) {
        const options = { limit: 100 };
        console.log("tick!")
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.fetchMessages(options);
        sum_messages.push(...messages.array());
        last_id = messages.last().id;

        if (messages.size != 100 || sum_messages >= limit) {
            console.log("Exited with: ", Object.keys(sum_messages).length )
            break;
        }
    }

    return sum_messages;
}

function resety(timeSet) {
    setTimeout(cryptoMax, timeSet)
}

bot.login(herokuTokens[2]);