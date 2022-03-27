const { MessageEmbed } = require('discord.js');
const { checkEmeraldID } = require('../flow/scripts/checkEmeraldID');
const { resolveAddressObject } = require('../flow/scripts/resolveNames');

const execute = async (interaction, options) => {
    let discordUser = options.getUser('user');
    let discordId = discordUser.id;
    let emeraldID = await checkEmeraldID(discordId);
    if (!emeraldID) {
        interaction.reply({ ephemeral: true, content: 'This user does not have an EmeraldID.' })
    }
    let obj = await resolveAddressObject(emeraldID);
    console.log(obj)
    sendIdentification(interaction, obj.address, obj.resolvedNames.find, obj.resolvedNames.fn)
}

const sendIdentification = (interaction, address, find, fn) => {
    console.log(address, find, fn)
    const embed = new MessageEmbed()
        .setColor('#5bc595')
        .addFields(
            { name: 'Address', value: address || "N/A", inline: true },
            { name: '.find', value: find || "N/A", inline: true },
            { name: '.fn', value: fn || "N/A", inline: true },
            { name: 'EmeraldID', value: "✅", inline: true }
        )
        .setAuthor('Emerald City', 'https://i.imgur.com/YbmTuuW.png', 'https://discord.gg/emeraldcity')
        .setThumbnail('https://i.imgur.com/UgE8FJl.png');

    interaction.reply({ embeds: [embed] }).catch(e => console.log(e));
}

module.exports = {
    name: 'identify',
    description: 'identify an on-chain user',
    execute: execute,
}