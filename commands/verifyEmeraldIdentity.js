const { changeAuthData } = require('../flowscripts/write_data.js');
const { Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
/*
    args[0] == NFT/FT/FIND
    args[1] == contract name
    args[2] == contract address
    args[3] == # of token
    args[4] == public path
    args[5] == discord role
    args[6] == mainnet/testnet
    args[7] == optional link
*/
const execute = async (message, args) => {
    if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        if ((args.length === 7 || args.length === 8) && (!isNaN(args[3])) && (args[0] === 'NFT' || args[0] === 'FT') && (args[6] === "mainnet" || args[6] === "testnet")) {
            let role = message.guild.roles.cache.find(role => role.name === args[5]);
            if (!role) {
                message.channel.send("This role does not exist!");
                return;
            }

            let guildId = message.guild.id
            let tokenType = args[0];
            let contractName = args[1];
            let contractAddress = args[2];
            let number = args[3];
            let path = args[4];
            let network = args[6];
            let url = (args.length === 8) ? args[7] : "";

            let setupResult = await changeAuthData(guildId, tokenType, contractName, contractAddress, number, path, role.id, url, network);
            if (!setupResult) {
                message.channel.send("The setup failed.");
                return;
            }
            
            postEmeraldIDVerifier(message, role.id);
        } else if (args.length === 2) {
            if (args[0] === 'FIND' || args[0] === 'GeniaceMETALMANEKI' || args[0] === 'Flovatar') {
                console.log("Setting up", args[0]);
                let role = message.guild.roles.cache.find(role => role.name === args[1]);
                if (!role) {
                    message.channel.send("This role does not exist!");
                    return;
                }

                let contractAddress = args[0] === 'FIND' 
                                        ? "0x097bafa4e0b48eef"
                                        : args[0] === 'GeniaceMETALMANEKI'
                                        ? "0xabda6627c70c7f52"
                                        : args[0] === 'Flovatar'
                                        ? "0x921ea449dffec68a"
                                        : null

                let url = args[0] === 'FIND' 
                            ? "https://find.xyz/"
                            : args[0] === 'GeniaceMETALMANEKI'
                            ? "https://www.geniace.com/"
                            : args[0] === 'Flovatar'
                            ? "https://flovatar.com/"
                            : null

                let setupResult = await changeAuthData(message.guild.id, args[0], "", contractAddress, 1, "", role.id, url, "mainnet");
                if (!setupResult) {
                    message.channel.send("The setup failed.");
                    return;
                }
                
                postEmeraldIDVerifier(message, role.id);
            }
        } else {
            message.channel.send("You did not supply the correct number of arguments. `!setup [NFT/FT] [contract name] [contract address] [number of tokens] [public path] [role name] [mainnet/testnet] [OPTIONAL: link to the minting site]`")
        }
    } else {
        console.log("You do not have permissions to do this.")
    }
}

const postEmeraldIDVerifier = (message, roleID) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`emeraldid-${roleID}`)
                .setLabel('Verify')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId(`emeraldiddelete`)
                .setLabel('Delete EmeraldID')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setURL('https://github.com/jacob-tucker/blocto-auth-discord-bot')
                .setLabel('Source')
                .setStyle('LINK')
        );

    const embed = new MessageEmbed()
        .setColor('#5bc595')
        .setTitle('Verify with your EmeraldID')
        .setAuthor('Emerald City', 'https://i.imgur.com/YbmTuuW.png', 'https://discord.gg/emeraldcity')
        .setDescription('Click the `Verify` button below to get the ' + `<@&${roleID}>` + ' role with your EmeraldID.')
        .setThumbnail('https://i.imgur.com/UgE8FJl.png');

    message.channel.send({ ephemeral: true, embeds: [embed], components: [row] }).catch(e => console.log(e));
}

module.exports = {
    name: 'verifyEmeraldIdentity',
    description: 'create or verify your emerald identity',
    execute: execute,
}

