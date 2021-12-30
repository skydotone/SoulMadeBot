const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const { checkNetwork } = require('../flowscripts/check_network.js');

const execute = async (message, args) => {

	let network = await checkNetwork(message.guild.id);

	if (network === "") {
		return;
	}

	if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(`${network}-join`)
					.setLabel('Validate')
					.setStyle('PRIMARY'),
			);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Verify your token holdings.')
			.setDescription('Click the "Validate" button to verify your token holdings.');

		message.channel.send({ ephemeral: true, embeds: [embed], components: [row] }).catch(e => console.log(e));
	}
}

module.exports = {
	name: 'join',
	description: 'set up a validate button',
	execute: execute,
}

