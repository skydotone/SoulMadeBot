require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const { getBalance } = require('./flowscripts/check_token.js');
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
        message.channel.send('Testing!');
    } else if (command === 'youtube') {
        client.commands.get('youtube').execute(message, args);
    } else if (command === 'join') {
        client.commands.get('join').execute(message, { uuid: encrypt(message.member.id), guildID: encrypt(message.guild.id) });
    } else if (command === 'role') {
        client.commands.get('role').execute(message, args);
    } else if (command === 'allroles') {
        client.commands.get('allroles').execute(message, args);
    } else if (command === 'setup') {
        client.commands.get('setup').execute(message, args);
    } else if (command === 'mint') {
        client.commands.get('mint').execute(message, args);
    }
})

/* SERVER */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/join', async (req, res) => {
    // Let's ensure that the account proof is legit.
    let accountProofObject = req.body.user.services.filter(service => service.type === 'account-proof')[0];
    const AccountProof = accountProofObject.data;
    // Gets the balance of the user
    let guildInfo = await getBalance(AccountProof, decrypt(req.body.guildID));
    if (!guildInfo) return;
    let { result, number, role, guildID } = guildInfo;

    // 'guild' == the server
    const guild = client.guilds.cache.get(guildID)
    // gets the member by first decrypting the uuid and getting back
    // the member id of the member, then gets the actual member

    try {
        let member = guild.members.cache.get(decrypt(req.body.uuid))
        if (result && (result >= number)) {
            member.roles.add(role).catch(() => member.user.send('Cannot add this role because it higher priority than the "Emerald" role in Server Settings > Roles.').catch(() => console.log("User DMs off.")));
            member.user.send('You have been granted a special role, congradulations!').catch(() => console.log("User DMs off"));
        } else {
            member.user.send('You have not yet minted your tokens.').catch(() => console.log("User DMs off."));
        }
    } catch (e) {
        console.log("An error occured decrypting: " + e);
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// This is the bot's token
// Must be at the bottom of the file
client.login(process.env.TOKEN);