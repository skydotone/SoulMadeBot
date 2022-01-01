const { changeAuthData } = require('../flowscripts/write_data.js');
const { Permissions } = require('discord.js');
/*
    args[0] == NFT/FT/FIND
    args[1] == contract name
    args[2] == contract address
    args[3] == # of token
    args[4] == public path
    args[5] == discord role
    args[6] == mainnet/testnet
    args[7] == optional minting link
*/
const execute = (message, args) => {
    if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        if ((args.length === 7 || args.length === 8) && (!isNaN(args[3])) && (args[0] === 'NFT' || args[0] === 'FT') && (args[6] === "mainnet" || args[6] === "testnet")) {
            let role = message.guild.roles.cache.find(role => role.name === args[5]);
            if (!role) {
                message.channel.send("This role does not exist!");
                return;
            }

            if (args.length === 7) changeAuthData(message.guild.id, args[0], args[1], args[2], args[3], args[4], role.id, "", args[6])
            else if (args.length === 8) changeAuthData(message.guild.id, args[0], args[1], args[2], args[3], args[4], role.id, args[7], args[6])
        } else if (args.length == 2 && args[0] === 'FIND') {
            changeAuthData(message.guild.id, args[0], "", "", 1, "", args[1], "https://find.xyz", "mainnet")
        } else {
            message.channel.send("You did not supply the correct number of arguments. `!setup [NFT/FT] [number of tokens] [public path] [role name] [OPTIONAL: link to the minting site]`")
        }
    } else {
        console.log("You do not have permissions to do this.")
    }
}

module.exports = {
    name: 'setup',
    description: 'setup auth for your server',
    execute: execute,
}

