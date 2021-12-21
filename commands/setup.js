const { changeAuthData } = require('../flowscripts/write_data.js');
const { Permissions } = require('discord.js');

const execute = (message, args) => {
    if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && (args.length === 6 || args.length === 7) && (!isNaN(args[3])) && (args[0] === 'NFT' || args[0] === 'FT')) {
        let role = message.guild.roles.cache.find(role => role.name === args[5]);
        if (!role) {
            message.channel.send("This role does not exist!");
            return;
        }

        // GuildID, NFT/FT, #, public path name, role id, optional minting link
        if (args.length === 6) changeAuthData(message.guild.id, args[0], args[1], args[2], args[3], args[4], role.id, "")
        else if (args.length === 7) changeAuthData(message.guild.id, args[0], args[1], args[2], args[3], args[4], role.id, args[6])
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

