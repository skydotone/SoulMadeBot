const execute = (message, args) => {
    if (message.member.id === 143100912687251456n) {
        postEmeraldIDVerifier(message, process.env.EMERALDIDROLE);
    }
}

const postEmeraldIDVerifier = (message, roleID) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`emeraldid-${roleID}`)
                .setLabel('Verify')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId(`emeraldiddelete`)
                .setLabel('Reset EmeraldID')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setURL('https://github.com/jacob-tucker/blocto-auth-discord-bot')
                .setLabel('Source')
                .setStyle('LINK')
        );

    const embed = new MessageEmbed()
        .setColor('#5bc595')
        .setTitle('Verify with your EmeraldID')
        .setAuthor('Emerald City', 'https://i.imgur.com/YbmTuuW.png', 'https://discord.gg/emeraldcity')
        .setDescription('Click the `Verify` button below to get the ' + `<@&${roleID}>` + ' role with your EmeraldID.')
        .setThumbnail('https://i.imgur.com/UgE8FJl.png');

    message.channel.send({ ephemeral: true, embeds: [embed], components: [row] }).catch(e => console.log(e));
}

module.exports = {
    name: 'getEmeraldIDRole',
    description: 'get the EmeraldID role inside EmeraldCity',
    execute: execute,
}

