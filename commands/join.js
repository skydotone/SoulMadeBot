const { MessageActionRow, MessageButton, MessageEmbed, Permissions, EmbedAuthorData } = require('discord.js');
const { checkNetwork } = require('../flowscripts/check_network.js');

const execute = async (message, args) => {

	let network = await checkNetwork(message.guild.id);

	console.log(network);
	if (network === "") {
		return;
	}
	console.log("Made it!")

	if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
		console.log("Has permissions!")
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(`${network}-join`)
					.setLabel('Validate')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setURL('https://github.com/jacob-tucker/blocto-auth-discord-bot')
					.setLabel('Source')
					.setStyle('LINK')
			);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Verify your token holdings')
			.setAuthor('Emerald City')
			.setDescription('Click the button below to verify your token holdings.')
			.setThumbnail('https://i.imgur.com/a/Jt7zGRo.png');

		message.channel.send({ ephemeral: true, embeds: [embed], components: [row] }).catch(e => console.log(e));
	}
}

module.exports = {
	name: 'join',
	description: 'set up a validate button',
	execute: execute,
}

