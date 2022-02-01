const execute = (message, args) => {
    // message.author.send is for DMs
    message.channel.send('https://www.youtube.com/channel/UCf6DzMRwj7SJ3nPrZqd5hHw');
}

module.exports = {
    name: 'youtube',
    description: 'this returns the youtube channel',
    execute: execute
}