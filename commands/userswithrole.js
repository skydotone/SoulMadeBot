const { MessageEmbed } = require('discord.js');
const { checkEmeraldID } = require('../flow/scripts/checkEmeraldID');

const execute = async (interaction, options) => {
  const role = interaction.guild.roles.cache.find(role => role === options.getRole('role'));
  if (!role) {
    interaction.reply({ ephemeral: true, content: 'This role does not exist.' }).catch(e => console.log(e));
    return;
  }
  sendInfo(interaction, role.id);
}

const sendInfo = async (interaction, roleId) => {
  let usersWithRole = interaction.guild.roles.cache.get(roleId).members.map(m => {
    return {
      id: m.user.id,
      tag: m.user.tag
    }
  });

  let fields = [];
  for (let i = 0; i < usersWithRole.length; i++) {
    const user = usersWithRole[i];
    const emeraldID = await checkEmeraldID(user.id)
    fields.push({
      name: user.tag,
      value: emeraldID || 'N/A'
    });
  }

  const embed = new MessageEmbed()
    .addFields(
      fields
    )

  interaction.reply({ content: `Users with the <@&${roleId}> role:`, embeds: [embed] });
}

module.exports = {
  name: 'userswithrole',
  description: 'get discord name and address of someone in a role',
  execute
}