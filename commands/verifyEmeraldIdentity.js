const {MessageActionRow, MessageEmbed, MessageButton} = require('discord.js');

const execute = (message, args) => {
    console.log("Posting verify emerald id message.")
    let discordID = message.member.id
    if (discordID !== "143100912687251456") {
        console.log(discordID);
        return;
    }
    
    postEmeraldIDVerifier(message);
}

const postEmeraldIDVerifier = (message) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`verify-emeraldid`)
                .setLabel('Verify EmeraldID')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setURL('https://github.com/jacob-tucker/blocto-auth-discord-bot')
                .setLabel('Source')
                .setStyle('LINK')
        );

    const embed = new MessageEmbed()
        .setColor('#5bc595')
        .setTitle('Verify your EmeraldID')
        .setAuthor('Emerald City', 'https://i.imgur.com/YbmTuuW.png', 'https://discord.gg/emeraldcity')
        .setDescription('Click the `Verify EmeraldID` button below to verify your EmeraldID.')
        .setThumbnail('https://i.imgur.com/UgE8FJl.png');

    message.channel.send({ ephemeral: true, embeds: [embed], components: [row] }).catch(e => console.log(e));
}

module.exports = {
    name: 'verifyEmeraldIdentity',
    description: 'create or verify your emerald identity',
    execute: execute,
}

