const { getMintURL } = require('../flowscripts/mint_url.js');

const execute = async (message, args) => {
    // message.author.send is for DMs
    let mintURL = await getMintURL(message.guild.id);

    message.channel.send('Mint your tokens here: <' + mintURL + '>');
}

module.exports = {
    name: 'mint',
    description: 'return a link where users can get the token they need to authorize',
    execute: execute
}