const { MessageEmbed } = require('discord.js');

const execute = (message, args) => {
    // const botInfo = new MessageEmbed().addField(`Hello there! Please click [this](http://localhost:3000/?id=${args.uuid}) link to gain access to Emerald City.`)
    const exampleEmbed = new MessageEmbed()
        .setColor('#5bc595')
        .setTitle('Click here to verify your account')
        .setURL('https://pedantic-darwin-e512ad.netlify.app/?id=' + args.uuid + '&guildID=' + args.guildID)
        .setAuthor('Emerald City Bot', 'https://i.imgur.com/qjT7cro.png')
        .setDescription('Hey there! Please click the link above if you have the tokens you need and wish to gain access to be given a special role.')
        .setTimestamp()

    message.author.send({ embeds: [exampleEmbed] }).catch(() => message.reply("Can't send DM to your user, they probably have DMs off. ;("));
}

module.exports = {
    name: 'join',
    description: 'checks to see if a user has enough tokens',
    execute: execute,
}

