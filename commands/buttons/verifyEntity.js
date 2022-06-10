const { entities } = require('../../flow/scripts/checkEntity.js');

const execute = async (interaction, options, emeraldIds) => {
    const name = options[0];

    const roleIds = await entities[name](emeraldIds);
    if (roleIds.error) {
        await interaction.editReply({ content: roleIds.message, ephemeral: true });
    } else if (roleIds.length > 0) {
        interaction.member.roles.add(roleIds).catch((e) => console.log(e));
        const displayRoles = roleIds.map(roleId => `<@&${roleId}>`).join(', ');
        await interaction.editReply({ content: "You have been given the following roles: " + displayRoles, ephemeral: true });
    } else {
        await interaction.editReply({ content: `You did not receive any roles.`, ephemeral: true });
    }
}

module.exports = {
    name: 'button-verifyEntity',
    description: 'verifies all the users assets for a registered entity and sets appropriate roles',
    execute,
}