//const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const fs = require("fs");
const rp = require('request-promise');
const prefix = "!" || botSettings.prefix;
const bot = new Discord.Client({});
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
        'X-CMC_PRO_API_KEY': process.env.crypt
    },
    json: true,
};

function cryptoMax() {

    let channelCrypto = bot.guilds.find(x => x.id === "681399606093152278").channels.find(x => x.id === "682773483884642304")
    let roleCrypto = bot.guilds.find(x => x.id === "681399606093152278").roles.find(y => y.id === "683145638225248277");
    bot.guilds.find(x => x.id === "681399606093152278").channels.find(x => x.id === "683229417513811988").fetchMessage('683537412592369664').then(configMsg => {

        let parseJson = JSON.parse(configMsg.content)
        let cryptoArr = parseJson.crypto
        let timeSet = parseJson.time * 60 * 1000

        rp(requestOptions).then(response => {

            module.exports.responseSave = response
            let fieldText = ''
            let outstandingText = ''

            for (x of cryptoArr) {
                let cryptoQuote = response.data.filter(d => d.symbol == x)[0].quote.SGD
                let quotePrice = cryptoQuote.price.toFixed(2).padStart(7, " ")
                let quotePercentChg = cryptoQuote.percent_change_24h.toFixed(2).padStart(5, " ")
                //console.log(cryptoQuote)

                if (quotePercentChg >= 5 || quotePercentChg <= -5) {
                    outstandingText += `${x}: ${quotePrice} (${quotePercentChg}%)\n`
                    channelCrypto.send(`${roleCrypto} ${x} had change of ${quotePercentChg}%! (${quotePrice.replace(/\s/g, '')}USD)`)
                }
                else {
                    fieldText += `${x}: ${quotePrice} (${quotePercentChg}%)\n`
                }
            }

            const Embed = new Discord.RichEmbed()
                .setColor('#00ff00')
                .addField('__Crypto Listings__', '```' + fieldText + '```', true)
                .setTimestamp()
                .setFooter('All prices in USD');
            if (outstandingText) {
                Embed.addField('__Outstanding__', '```' + outstandingText + '```', true)
                Embed.setColor('#ff0000')
            }

            channelCrypto.send(Embed);


        }).catch((err) => {
            console.log('API call error:', err.message);
        });
        resety(timeSet)
    })
}

function resety(timeSet) {
    setTimeout(cryptoMax, timeSet)
}

bot.login(process.env.token);