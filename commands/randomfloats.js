const { getRandomFloats } = require('../flow/scripts/getRandomFloats');
const { toAddress } = require('../flow/scripts/resolveNames');

const execute = async (interaction, options) => {
    await interaction.deferReply({ ephemeral: true });
    const creator = options.getString('account');
    let resolved = creator;
    if (resolved.includes('.') || resolved.slice(0, 2) !== '0x') {
      resolved = await toAddress(creator);
    }
    if (!resolved) {
      return {error: true, message: 'This account is invalid.'};
    }
    const eventId = options.getString('eventid');
    let number = options.getInteger('number');
    if (number > 25) {
        number = 25;
    }

    const holders = await getRandomFloats(resolved, eventId);
    if (holders.error) {
        await interaction.followUp({ ephemeral: true, content: holders.message }).catch(e => console.log(e));
        return;
    }
    if (holders.length < number) {
        number = holders.length;
    }
    let results = [];
    for (var i = 0; i < number; i++) {
        const random = Math.floor(Math.random() * (holders.length));
        results[i] = {
            name: "Winner #" + (i + 1),
            value: holders[random].address,
            inline: true
        }
    }
    postRandoms(interaction, creator, eventId, results);
}

const postRandoms = async (interaction, creator, eventId, results) => {
    const embed = {
        color: '#5bc595',
        title: "Winners from Event #" + eventId,
        url: `https://floats.city/${creator}/event/${eventId}`,
        author: {
            name: 'FLOAT',
            url: 'https://floats.city/',
            iconURL: 'https://i.imgur.com/qOC18pn.png'
        },
        fields: results
    };

    await interaction.editReply({ ephemeral: false, embeds: [embed] }).catch(e => console.log(e));
}

module.exports = {
    name: 'randomfloats',
    description: 'return random float holders to win a giveaway',
    execute,
}