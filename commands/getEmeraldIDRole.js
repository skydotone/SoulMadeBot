const { postEmeraldIDVerifier } = require('./setup.js');
const execute = (message, args) => {
    if (message.member.id === "143100912687251456") {
        postEmeraldIDVerifier(message, process.env.EMERALDIDROLE);
    }
}

module.exports = {
    name: 'getEmeraldIDRole',
    description: 'get the EmeraldID role inside EmeraldCity',
    execute: execute,
}

