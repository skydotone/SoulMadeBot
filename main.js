require('dotenv').config();
const { Client, Intents, Collection, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { getBalance } = require('./flowscripts/check_token.js');
const { getBalancev2 } = require('./flowscripts/check_tokenv2.js');
const { checkEmeraldIdentityDiscord, checkEmeraldIdentityAccount, initializeEmeraldID, deleteEmeraldID } = require('./flowscripts/emerald_identity.js');
const { encrypt, decrypt } = require('./helperfunctions/functions.js');

const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
var corsOptions = {
    origin: ['https://pedantic-darwin-e512ad.netlify.app', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST']
};
app.use(cors(corsOptions));
const port = process.env.PORT || 5000;

const prefix = '!';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Gets all of our commands from our commands folder
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // command.name is the name of the file,
    // and command has a list of all the module exports
    // in that file.
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Emerald bot is online!');
})

// When a user types a message
client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // Executes the youtube.js file
    if (command === 'test') {
        console.log("wtf")
        message.channel.send('Testing!');
    } else if (command === 'youtube') {
        client.commands.get('youtube').execute(message, args);
    } else if (command === 'role') {
        client.commands.get('role').execute(message, args);
    } else if (command === 'setup') {
        client.commands.get('setup').execute(message, args);
    } else if (command === 'verifyecid') {
        client.commands.get('verifyEmeraldIdentity').execute(message, args);
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId.split('-').length === 3) {
        let interactionCustomId = interaction.customId.split('-');
        let encrypted = encrypt(interaction.member.id + '///' + interaction.guild.id + '///' + interactionCustomId[1])
    
        // const botInfo = new MessageEmbed().addField(`Hello there! Please click [this](http://localhost:3000/?id=${args.uuid}) link to gain access to Emerald City.`)
        const exampleEmbed = new MessageEmbed()
            .setColor('#5bc595')
            .setDescription('Click the link below to verify your account.')
            .setTimestamp()
    
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setURL('https://pedantic-darwin-e512ad.netlify.app/' + interactionCustomId[0] + '/?id=' + encrypted)
                    .setLabel('Verify Account')
                    .setStyle('LINK')
            );
    
        interaction.reply({ ephemeral: true, embeds: [exampleEmbed], components: [row] })
    } else if (interaction.customId.split('-').length === 2) {
        let interactionCustomId = interaction.customId.split('-');
        let roleId = interactionCustomId[1];
        let account = await checkEmeraldIdentityDiscord(interaction.member.id);
        console.log("Returned account from ecid", account);
        // If they have already verified their EmeraldID
        if (account) {
            let guildInfo = await getBalancev2(account, interaction.guild.id, roleId);
            if (!guildInfo) {
                interaction.reply("Error");
                return;
            };
            let { result, number } = guildInfo;
            if (result && (result >= number)) {
                console.log("Adding role...");
                interaction.member.roles.add(roleId).catch((e) => console.log(e));
                interaction.reply("You have been given the " + `<@&${roleId}>` + " role.");
                return;
            }
            interaction.reply("You do not have enough tokens.");
            return;
        }

        // If they have not verified their EmeraldID...

        let encrypted = encrypt(interaction.member.id);
    
        // const botInfo = new MessageEmbed().addField(`Hello there! Please click [this](http://localhost:3000/?id=${args.uuid}) link to gain access to Emerald City.`)
        const exampleEmbed = new MessageEmbed()
            .setColor('#5bc595')
            .setDescription('Click the link below to setup your EmeraldID.')
            .setTimestamp()
    
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setURL('https://pedantic-darwin-e512ad.netlify.app/emeraldID' + '/?id=' + encrypted)
                    .setLabel('Setup EmeraldID')
                    .setStyle('LINK')
            );
    
        interaction.reply({ ephemeral: true, embeds: [exampleEmbed], components: [row] });
    } else if(interaction.customId === 'emeraldiddelete') {
        let account = await checkEmeraldIdentityDiscord(interaction.member.id);
        if (!account) {
            interaction.reply("You do not have an EmeraldID.");
        } else {
            deleteEmeraldID(account, interaction.member.id);
            interaction.reply("Deleting your EmeraldID. Please wait ~20 seconds.");
        }
    }
});

/* SERVER */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/join', async (req, res) => {
    // Let's ensure that the account proof is legit. 
    console.log("Account address:", req.body.user.addr)
    let accountProofObject = req.body.user.services.filter(service => service.type === 'account-proof')[0];
    if (!accountProofObject) return res.send({"success": 2});

    const AccountProof = accountProofObject.data;

    let decrypted;
    try {
        decrypted = decrypt(req.body.id);
    } catch(e) {
        console.log(e);
        return res.send({"success": 2});
    }

    let decryptedValues = decrypted.split('///');
    
    // Gets the balance of the user
    let guildInfo = await getBalance(AccountProof, decryptedValues[1], decryptedValues[2], req.body.network);
    console.log("GuildInfo", guildInfo)
    if (!guildInfo) return res.send({"success": 2});
    let { result, number, role, guildID } = guildInfo;

    // 'guild' == the server
    const guild = client.guilds.cache.get(guildID)
    // gets the member by first decrypting the uuid and getting back
    // the member id of the member, then gets the actual member

    try {
        let member = guild.members.cache.get(decryptedValues[0])
        console.log("Result: " + result + " - " + "Number: " + number);
        if (result && (result >= number)) {
            console.log("Adding role...");
            member.roles.add(role).catch((e) => console.log(e));
            return res.send({"success": 1});
        }
    } catch (e) {
        console.log("An error occured decrypting: " + e);
    }

    res.send({"success": 2});
});

app.post('/api/connectEmeraldID', async (req, res) => {
    // Let's ensure that the account proof is legit. 
    console.log("Account address:", req.body.user.addr)
    let accountProofObject = req.body.user.services.filter(service => service.type === 'account-proof')[0];
    if (!accountProofObject) return res.send("Invalid account proof.");

    const accountAddress = accountProofObject.data.address;

    let discordID;
    try {
        discordID = decrypt(req.body.id);
        console.log(discordID);
    } catch(e) {
        console.log(e);
        return res.send("Decryption error. Please re-launch this page from Discord.");
    }

    let success = await initializeEmeraldID(accountAddress, discordID);
    if (success) {
        let guild = client.guilds.cache.get(process.env.EMERALDCITYGUILDID);
        console.log(guild);
        let member = guild.members.cache.get(discordID)
        console.log(member);
        member.roles.add(process.env.EMERALDIDROLE).catch((e) => console.log(e));
        return res.send("Success");
    } else {
        return res.send("Failure");
    }
    
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// This is the bot's token
// Must be at the bottom of the file
client.login(process.env.TOKEN);