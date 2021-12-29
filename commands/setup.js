const { changeAuthData } = require('../flowscripts/write_data.js');
const { Permissions } = require('discord.js');

const execute = (message, args) => {
    if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) && (args.length === 7 || args.length === 8) && (!isNaN(args[3])) && (args[0] === 'NFT' || args[0] === 'FT') && (args[6] === "mainnet" || args[6] === "testnet")) {
        let role = message.guild.roles.cache.find(role => role.name === args[5]);
        if (!role) {
            message.channel.send("This role does not exist!");
            return;
        }

        let network = args[6];
        if (network === 'testnet') {
            network = "https://access-testnet.onflow.org"
        } else if (network === 'mainnet') {
            network = "https://access-mainnet-beta.onflow.org"
        }
        // GuildID, NFT/FT, #, public path name, role id, optional minting link, network
        if (args.length === 7) changeAuthData(message.guild.id, args[0], args[1], args[2], args[3], args[4], role.id, "", network)
        else if (args.length === 8) changeAuthData(message.guild.id, args[0], args[1], args[2], args[3], args[4], role.id, args[7], network)
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

