const { checkOwnsCustom } = require('../flow/scripts/checkOwnsCustom.js');

const execute = async (interaction, options, emeraldIds) => {
    const customName = options[0];
    const roleId = options[1];
    const ownsCustomBlocto = await checkOwnsCustom(customName, emeraldIds["blocto"]);
    const ownsCustomDapper = await checkOwnsCustom(customName, emeraldIds["dapper"]);
    if (ownsCustomBlocto === true || ownsCustomBlocto > 0 || ownsCustomDapper === true || ownsCustomDapper > 0) {
        interaction.member.roles.add(roleId).catch((e) => console.log(e));
        await interaction.editReply({ content: "You have been given the " + `<@&${roleId}>` + " role.", ephemeral: true });
    } else {
        await interaction.editReply({ content: `You do not meet the requirements for ${customName}.`, ephemeral: true });
    }
}


module.exports = {
    name: 'verifyCustom',
    description: 'verifies if a user has a custom entity that is pre-defined in ./flow/holdings/nftholdings.js',
    execute,
}