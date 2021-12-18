const { changeAuthData } = require('../flowscripts/write_data.js');
const { Permissions } = require('discord.js');

const execute = (message, args) => {
    if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && (args.length === 3 || args.length === 4)) {
        // 1. GuildID, NFT/FT, #, public path name, optional minting link
        if (args.length === 3) changeAuthData(message.guild.id, args[0], args[1], args[2], "")
        else if (args.length === 4) changeAuthData(message.guild.id, args[0], args[1], args[2], args[3])
        console.log("Has permissions.")
    } else if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        console.log("You did not supply the correct number of arguments. `!setup [NFT/FT] [number of tokens] [public path]`")
    } else {
        console.log("You do not have permissions to do this.")
    }
}

module.exports = {
    name: 'setup',
    description: 'setup auth for your server',
    execute: execute,
}

