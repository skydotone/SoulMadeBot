const { checkOwnsDapper } = require('../flow/scripts/checkOwnsDapper.js');

const execute = async (interaction, options, emeraldIds) => {
    const customName = options[0];
    const roleId = options[1];
    const user = emeraldIds["dapper"];
    if (!user) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setURL('https://id.ecdao.org/')
                    .setLabel('Create your Dapper EmeraldID')
                    .setStyle('LINK')
            );
        await interaction.editReply({ content: `You do not own a Dapper EmeraldID.`, ephemeral: true, components: [row] });
    }

    const ownsDapper = await checkOwnsDapper(customName.replace(/\s/g, "").toLowerCase(), user);
    if (ownsDapper === true) {
        interaction.member.roles.add(roleId).catch((e) => console.log(e));
        await interaction.editReply({ content: "You have been given the " + `<@&${roleId}>` + " role.", ephemeral: true });
    } else {
        await interaction.editReply({ content: `You do not meet the requirements for ${customName}.`, ephemeral: true });
    }
}


module.exports = {
    name: 'verifyDapper',
    description: 'verifies if a user has a custom dapper product that is pre-defined in ./flow/holdings/dapperholdings.js',
    execute,
}