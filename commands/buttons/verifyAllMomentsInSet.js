const { ownsAllInSet } = require('../../flow/scripts/nbatopshot.js');

const execute = async (interaction, options, emeraldIds) => {
    const setName = options[0];
    const roleId = options[1];

    const ownsAll = await ownsAllInSet(emeraldIds["dapper"], setName);
    if (ownsAll === true) {
        interaction.member.roles.add(roleId).catch((e) => console.log(e));
        await interaction.editReply({ content: "You have been given the " + `<@&${roleId}>` + " role.", ephemeral: true });
    } else {
        await interaction.editReply({ content: ownsAll.message, ephemeral: true });
    }
}


module.exports = {
    name: 'button-verifyAllMomentsInSet',
    description: 'verifies if a user has all the moments from a set',
    execute,
}