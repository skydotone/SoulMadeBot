const { Client, Intents, Collection } = require('discord.js');
const { serverID, token, userRole } = require('./config.json');
const { getBalance } = require('./flowscript.js');

const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

// Decrypting text
function decrypt(text) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

const app = express();
const port = process.env.PORT || 5000;

const prefix = '-';
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
        client.commands.get('join').execute(message, { uuid: encrypt(message.member.id) });
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
    let balance = await getBalance(AccountProof);

    // 'guild' == the server
    const guild = client.guilds.cache.get(serverID)
    // gets the member by first decrypting the uuid and getting back
    // the member id of the member, then gets the actual member
    const member = guild.members.cache.get(decrypt(req.body.uuid))
    if (balance) {
        if (balance >= 10) {
            member.roles.add(userRole);
            member.user.send('You have been granted access to Emerald City.')
        } else {
            member.user.send('You do not have enough tokens to join the community.')
        }
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// This is the bot's token
// Must be at the bottom of the file
client.login(token);