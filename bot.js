//const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const fs = require("fs");
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
    let msgCheck = rMsg == reactMessage.msgMember       ? "roleMember":
                   rMsg == reactMessage.msgKpop         ? "roleKpop":
                   rMsg == reactMessage.msgOverwatch    ? "roleOverwatch":
                   rMsg == reactMessage.msgHearthstone  ? "roleHearthstone":
                   rMsg == reactMessage.msgFornite      ? "roleFornite":
                   rMsg == reactMessage.msgApex         ? "roleApex":
                   null;

    if(!msgCheck) return
    let member = bot.guilds.find(x => x.id === "322271623543783424").members.get(user.id);
    let roleF = member.roles.has(reactRoles[msgCheck])

    if(!roleF) {
        member.addRole(reactRoles[msgCheck]).catch(console.error);
    }

});

bot.on('messageReactionRemove', (reaction, user) => {

    let rMsg = reaction.message.id;
    let msgCheck = rMsg == reactMessage.msgMember       ? "roleMember":
                   rMsg == reactMessage.msgKpop         ? "roleKpop":
                   rMsg == reactMessage.msgOverwatch    ? "roleOverwatch":
                   rMsg == reactMessage.msgHearthstone  ? "roleHearthstone":
                   rMsg == reactMessage.msgFornite      ? "roleFornite":
                   rMsg == reactMessage.msgApex         ?  "roleApex":
                   null;

    if(!msgCheck) return
    let member = bot.guilds.find(x => x.id === "322271623543783424").members.get(user.id);
    let roleF = member.roles.has(reactRoles[msgCheck])

    if(roleF) {
        member.removeRole(reactRoles[msgCheck]).catch(console.error);
    }
    
});

bot.login(process.env.token); //