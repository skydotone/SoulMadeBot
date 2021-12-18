const { changeAuthData } = require('../flowscripts/write_data.js');
const { Permissions } = require('discord.js');

const execute = (message, args) => {
    if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && (args.length === 3 || args.length === 4)) {
        let role = message.guild.roles.cache.find(role => role.name === args[0]);
        // 1. GuildID, NFT/FT, #, public path name, role name, optional minting link
        if (args.length === 3) changeAuthData(message.guild.id, args[0], args[1], args[2], role.id, "")
        else if (args.length === 4) changeAuthData(message.guild.id, args[0], args[1], args[2], role.id, args[4])
        console.log("Has permissions.")
    } else if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        message.channel.send("You did not supply the correct number of arguments. `!setup [NFT/FT] [number of tokens] [public path] [role name] [OPTIONAL: link to the minting site]`")
    } else {
        console.log("You do not have permissions to do this.")
    }
}

module.exports = {
    name: 'setup',
    description: 'setup auth for your server',
    execute: execute,
}

