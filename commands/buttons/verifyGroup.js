const { checkOwnsFloatFromGroup, checkOwnsAllFloatsFromGroup } = require('../../flow/scripts/float.js');

const execute = async (interaction, options, emeraldIds) => {
  const creator = options[0];
  const groupName = options[1].replaceAll(" : ", " - ");
  const roleId = options[2];
  const all = options[3];

  let passed;

  if (all === 'true') {
    passed = await checkOwnsAllFloatsFromGroup(creator, groupName, Object.values(emeraldIds));
  } else {
    passed = await checkOwnsFloatFromGroup(creator, groupName, Object.values(emeraldIds));
  }
  if (passed === true) {
    interaction.member.roles.add(roleId).catch((e) => console.log(e));
    await interaction.editReply({ content: "You have been given the " + `<@&${roleId}>` + " role.", ephemeral: true });
  } else {
    await interaction.editReply({ content: passed.message, ephemeral: true });
  }
}


module.exports = {
  name: 'button-verifyGroup',
  description: 'verifies if a user has a float inside of a group of events',
  execute,
}