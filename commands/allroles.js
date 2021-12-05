const { MessageEmbed } = require('discord.js');

const execute = (message, args) => {
    let rolemap = message.guild.roles.cache
        .filter(r => 
            r.editable && r.id != process.env.BETATESTERROLE
        )
        .map(r => r)
        .join(', ');

    if (rolemap.length > 1024) rolemap = "To many roles to display";
    if (!rolemap) rolemap = "No roles";
    const embed = new MessageEmbed()
        .addField("All the Roles You Can Get", rolemap)
    message.channel.send({ embeds: [embed] });
}

module.exports = {
    name: 'allroles',
    description: 'get all the roles you can add to yourself',
    execute: execute,
}

