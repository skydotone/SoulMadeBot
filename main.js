require('dotenv').config();
const { Client, Intents, Collection, Constants } = require('discord.js');
const path = require('path')

const fs = require('fs');
const fcl = require("@onflow/fcl");

const express = require('express');
const { checkEmeraldID } = require('./flow/scripts/checkEmeraldID');

const app = express();

fcl.config()
    .put('accessNode.api', 'https://mainnet.onflow.org')
    .put('0xFLOAT', '0x2d4c3caffbeab845')
    .put('0xFIND', '0x097bafa4e0b48eef')
    .put('0xFN', '0x233eb012d34b0070')
    .put('0xNFT', '0x1d7e57aa55817448')
    .put('0xEmeraldIdentity', '0x39e42c67cc851cfb')

const port = process.env.PORT || 5000;

const prefix = '!';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

// Gets all of our commands from our commands folder
client.commands = new Collection();

/*** THIS IS FOR ALL THE DIRECTORIES ***/
const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
getDirectories(__dirname + '/commands').forEach(category => {
    const commandFiles = fs.readdirSync(category).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`${category}/${file}`);
        client.commands.set(command.name, command);
    }
});

/*** THIS IS FOR ALL THE INDIVIDUAL FILES ***/
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Emerald bot is online!');

    // const guildId = '927688041919807558'; // Use your guild ID instead
    // const guild = client.guilds.cache.get(guildId);
    let commands = client.application?.commands;
    // if (guild) {
    //   commands = guild.commands;
    // } else {
    //   commands = client.application?.commands;
    // }

    commands?.create({
        name: 'resolve',
        description: 'Get information about a .find, .fn, or address.',
        options: [
            {
                name: 'account',
                description: 'An address, .find, or .fn name.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    });

    commands?.create({
        name: 'identify',
        description: 'Identify on-chain information about a user.',
        options: [
            {
                name: 'user',
                description: 'A Discord User',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.USER
            }
        ]
    });

    commands?.create({
        name: 'god',
        description: 'Take a look at God.'
    });

    commands?.create({
        name: 'userswithrole',
        description: 'Get a list of all the users with a certain role.',
        options: [
            {
                name: 'role',
                description: 'The role you wish to give',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.ROLE
            }
        ]
    });

    commands?.create({
        name: 'togglerole',
        description: 'Give someone the ability to get or remove a specific role.',
        options: [
            {
                name: 'role',
                description: 'The role you wish to give',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.ROLE
            },
            {
                name: 'description',
                description: 'A description of what this toggle does',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'image',
                description: 'A URL to an image that will display',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    });

    commands?.create({
        name: 'float',
        description: 'A group of commands for FLOAT.',
        options: [
            {
                name: 'random',
                description: 'Get a random number of FLOAT claimers from your event.',
                options: [
                    {
                        name: 'account',
                        description: 'The users address, .find, or .fn name',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'eventid',
                        description: 'The id of the event',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'number',
                        description: 'The number of claimers you would like to get',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.INTEGER
                    },
                    {
                        name: 'public',
                        description: 'Display results publically',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.BOOLEAN
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            },
            {
                name: 'verify',
                description: 'Setup a button to verify a user owns a FLOAT from a specified Event and give them a role for it.',
                options: [
                    {
                        name: 'eventid',
                        description: 'The id of the event',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.NUMBER
                    },
                    {
                        name: 'role',
                        description: 'The role you wish to give',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.ROLE
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            },
            {
                name: 'view',
                description: 'View a FLOAT from someones collection',
                options: [
                    {
                        name: 'account',
                        description: 'The users address, .find, or .fn name',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'floatid',
                        description: 'The ID of the FLOAT',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.NUMBER
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            },
            {
                name: 'verifygroup',
                description: 'Setup a button to verify a user owns a FLOAT from a certain group of FLOAT Events.',
                options: [
                    {
                        name: 'creator',
                        description: 'The Group creators address, .find, or .fn name',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'groupname',
                        description: 'The name of the Group',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'role',
                        description: 'The role you wish to give',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.ROLE
                    },
                    {
                        name: 'all',
                        description: 'If the user has to own ALL the FLOATs from this group',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.BOOLEAN
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            }
        ]
    });

    commands?.create({
        name: 'indiscord',
        description: 'Export a .csv of all the people currently in your Discord AMA',
        options: [
            {
                name: 'channel',
                description: 'The users address, .find, or .fn name',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.CHANNEL
            }
        ]
    });

    commands?.create({
        name: 'nbatopshot',
        description: 'A group of commands for NBATopShot.',
        options: [
            {
                name: 'momentsinset',
                description: 'View the moments a user has from a TopShot set',
                options: [
                    {
                        name: 'address',
                        description: 'The users Dapper Wallet address',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'setname',
                        description: 'The name of the set (ex. Cool Cats)',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            },
            {
                name: 'ownsallinset',
                description: 'Setup a verifier to check if the user owns all the moments in a set',
                options: [
                    {
                        name: 'setname',
                        description: 'The name of the set (ex. Cool Cats)',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'role',
                        description: 'The role you wish to give',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.ROLE
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            }
        ]
    });

    commands?.create({
        name: 'verify',
        description: 'A group of commands for verifying assets.',
        options: [
            {
                name: 'entity',
                description: 'Setup a verifier for an entity that was previously verified by Emerald City.',
                options: [
                    {
                        name: 'name',
                        description: 'The name provided by Emerald City.',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            },
            {
                name: 'token',
                description: 'Setup a button to verify a user owns X tokens from a certain vault.',
                options: [
                    {
                        name: 'contractname',
                        description: 'The name of the contract',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'contractaddress',
                        description: 'The address of the contract',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'publicpath',
                        description: 'The public path to the vault',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'amount',
                        description: 'The amount of tokens the user must hold',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'role',
                        description: 'The role you wish to give',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.ROLE
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            },
            {
                name: 'custom',
                description: 'Setup a button to verify a user owns a Custom entity.',
                options: [
                    {
                        name: 'customname',
                        description: 'The custom name',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'role',
                        description: 'The role you wish to give',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.ROLE
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            },
            {
                name: 'nft',
                description: 'Setup a button to verify a user owns a NFT from a certain collection.',
                options: [
                    {
                        name: 'contractname',
                        description: 'The name of the contract',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'contractaddress',
                        description: 'The address of the contract',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'publicpath',
                        description: 'The public path to the collection',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    },
                    {
                        name: 'role',
                        description: 'The role you wish to give',
                        required: true,
                        type: Constants.ApplicationCommandOptionTypes.ROLE
                    }
                ],
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            }
        ]
    });
})

// When a user types a message
client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // Executes the youtube.js file
    if (command === 'test') {
        console.log("wtf")
        message.channel.send('Jacob is so talented, smart, and attractive. I was not forced to say this.').catch((e) => console.log(e));
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        // If it's a button, we always want to make it ephemeral.
        await interaction.deferReply({ ephemeral: true });

        // Check the interactor's EmeraldID (null if they don't have one)
        const emeraldIds = await checkEmeraldID(interaction.member.id);
        console.log("EmeraldID", emeraldIds);
        if (!emeraldIds) {
            client.commands.get('initializeEmeraldID')?.execute(interaction);
            return;
        }
        let customIdArray = interaction.customId.replaceAll(" - ", " : ").split('-');
        const commandName = 'button-' + customIdArray.shift();
        client.commands.get(commandName)?.execute(interaction, customIdArray, emeraldIds);
    } else if (interaction.isCommand()) {
        const { options } = interaction;
        const commandName = options._subcommand ? interaction.commandName + '-' + options._subcommand : interaction.commandName;
        client.commands.get(commandName)?.execute(interaction, options);
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// This is the bot's token
// Must be at the bottom of the file
client.login(process.env.TOKEN);