const execute = (message, args) => {
    let role = message.guild.roles.cache.find(role => role.name === args[0]);
    if (!role) {
        message.channel.send('This is not a valid role you can add.')
    } else if (!role.editable) {
        message.channel.send('You do not have permissions to add this role to yourself.');
    } else {
        message.member.roles.add(role);
        message.channel.send('There you go! You now have the ' + role.name + ' role. :)');
    }
}

module.exports = {
    name: 'role',
    description: 'get a specific role',
    execute: execute,
}

