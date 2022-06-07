const { getFloatInfo } = require('../flow/scripts/getFloatInfo.js');

const execute = async (interaction, options) => {
    await interaction.deferReply({ ephemeral: false });
    let float = await getFloatInfo(options.getString('account'), options.getNumber('floatid'));
    if (float.error) {
        await interaction.followUp({ ephemeral: false, content: float.message }).catch(e => console.log(e));
        return;
    }
    postFloat(interaction, float);
}

const postFloat = async (interaction, float) => {
    if (float.eventDescription.length > 200) {
        float.eventDescription = float.eventDescription.substring(0, 200) + '...';
    }
    const embed = {
        color: '#5bc595',
        title: float.eventName,
        url: `https://floats.city/${float.owner}/float/${float.id}`,
        author: {
            name: 'FLOAT',
            url: 'https://floats.city/',
            iconURL: 'https://i.imgur.com/qOC18pn.png'
        },
        description: `${float.eventDescription}`,
        thumbnail: {
            url: `https://ipfs.infura.io/ipfs/${float.eventImage}`,
        },
        fields: [
            {
                name: "Owned by",
                value: float.owner,
                inline: true
            },
            {
                name: 'Id',
                value: String(float.id),
                inline: true
            },
            {
                name: 'Serial #',
                value: String(float.serial),
                inline: true
            }
        ],
    };

    await interaction.editReply({ embeds: [embed] }).catch(e => console.log(e));
}

module.exports = {
    name: 'float',
    description: 'display information about a float',
    execute,
}