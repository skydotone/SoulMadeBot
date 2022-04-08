const { MessageEmbed } = require('discord.js');
const { resolveAddressObject } = require('../flow/scripts/resolveNames');

const execute = async (interaction, options) => {
    await interaction.deferReply();
    let obj = await resolveAddressObject(options.getString('account'));
    sendNames(interaction, obj.address, obj.resolvedNames.find, obj.resolvedNames.fn)
}

const sendNames = async (interaction, address, find, fn) => {
    console.log(address, find, fn)
    const embed = new MessageEmbed()
        .setColor('#5bc595')
        .addFields(
            { name: 'Address', value: address || "N/A", inline: true },
            { name: '.find', value: find || "N/A", inline: true },
            { name: '.fn', value: fn || "N/A", inline: true },
        )
        .setAuthor('Emerald City', 'https://i.imgur.com/YbmTuuW.png', 'https://discord.gg/emeraldcity')
        .setThumbnail('https://i.imgur.com/UgE8FJl.png');

    await interaction.editReply({ embeds: [embed] }).catch(e => console.log(e));
}

module.exports = {
    name: 'resolve',
    description: 'resolve a .find or .fn name',
    execute,
}