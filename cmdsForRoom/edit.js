const Discord = require('discord.js');
const rp = require('request-promise');
const mainBot = require('../bot.js')

module.exports.run = async (bot, message, args) => {
	message.delete();
	message.channel.fetchMessage('683537412592369664').then(message => switchy(message)).catch(console.error);
	let response = mainBot.responseSave


	function switchy(configs) {

		let parseJson = JSON.parse(configs.content)
		let cryptoArr = parseJson.crypto
		let timeSet = parseJson.time
		let threshold = parseJson.threshold
		let cooldown = parseJson.cd

		switch (args[0]) {
			case 'add':
				let checkQuote = response.data.filter(d => d.symbol == args[1].toUpperCase())
				console.log(cryptoArr)
				if (!cryptoArr.includes(args[1]) && checkQuote.length != 0) {
					cryptoArr.push(args[1].toUpperCase())
				}
				else {
					message.channel.send('Error: `Name not found in Database!`').then(msg => { msg.delete(3000) })
				}
				printText(configs, cryptoArr, timeSet, threshold, cooldown)
				break;

			case 'remove':
				const index = cryptoArr.indexOf(args[1]);
				if (index > -1) {
					cryptoArr.splice(index, 1);
				}
				else {
					message.channel.send('Error: `Name not found`').then(msg => { msg.delete(3000) })
				}
				printText(configs, cryptoArr, timeSet, threshold, cooldown)
				break;

			case 'clear':
				printText(configs, ['MCO'], "10")
				break;

			case 'timeset':
				if (args[1] < 5) {
					message.channel.send('Error: `Minimum 5 minutes`').then(msg => { msg.delete(3000) })
				}
				else {
					printText(configs, cryptoArr, args[1], threshold, cooldown)
				}
				break;

			case 'thresholdset':
				printText(configs, cryptoArr, timeSet, args[1], cooldown)
				break;

			case 'cdset':
				printText(configs, cryptoArr, timeSet, threshold, args[1]);
				break;

			case 'test':
				printText(configs, cryptoArr, timeSet, threshold, "60")
				break;
		}

	}

	function printText(configs, cryptoArr, time, th, cd) {

		let newJSON = JSON.parse(configs.content)
		newJSON["crypto"] = cryptoArr
		newJSON["time"] = time
		newJSON["threshold"] = th
		newJSON["cd"] = cd

		configs.edit(JSON.stringify(newJSON))
	}

}



module.exports.help = {
	name: "c"
}