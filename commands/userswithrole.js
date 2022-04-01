const { MessageEmbed } = require('discord.js');
const { checkEmeraldID } = require('../flow/scripts/checkEmeraldID');

const execute = async (interaction, options) => {
  const role = options.getRole('role');
  if (!role) {
    interaction.reply({ ephemeral: true, content: 'This role does not exist.' }).catch(e => console.log(e));
    return;
  }
  sendInfo(interaction, role);
}

const sendInfo = async (interaction, role) => {
  const usersWithRole = role.members.map(m => {
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
    .setDescription(`Users with the <@&${role.id}> role:`)
    .addFields(
      fields
    )

  interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = {
  name: 'userswithrole',
  description: 'get discord name and address of someone in a role',
  execute
}