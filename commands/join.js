const execute = (message, args) => {
    message.author.send('http://localhost:3000/' + message.member.id);
}

module.exports = {
    name: 'join',
    description: 'checks to see if a user has enough tokens',
    execute: execute,
}

