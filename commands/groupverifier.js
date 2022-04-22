const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const { toAddress } = require('../flow/scripts/resolveNames');

const execute = async (interaction, options) => {
  if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    let role = interaction.guild.roles.cache.find(role => role === options.getRole('role'));
    if (!role) {
      interaction.reply({ ephemeral: true, content: 'This role does not exist.' }).catch(e => console.log(e));
      return;
    }

    const creator = options.getString('creator');
    let resolved = creator;
    if (resolved.includes('.') || resolved.slice(0, 2) !== '0x') {
      resolved = await toAddress(creator);
    }
    if (!resolved) {
      return {error: true, message: 'This account is invalid.'};
    }

    const groupName = options.getString('groupname');
    verifyGroupButton(interaction, creator, resolved, groupName, role.id);
  }
}

const verifyGroupButton = (interaction, creator, resolved, groupName, roleId) => {
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(`verifyGroup-${resolved}-${groupName}-${roleId}`)
        .setLabel('Verify')
        .setStyle('SUCCESS'),
      new MessageButton()
        .setURL('https://id.ecdao.org' + '/reset')
        .setLabel('Reset')
        .setStyle('LINK')
    );

  const embed = new MessageEmbed()
    .setColor('#5bc595')
    .setTitle(`Verify you own a FLOAT from ${groupName}`)
    .addFields(
      { name: 'Created by', value: creator },
    )
    .setAuthor('Emerald City', 'https://i.imgur.com/YbmTuuW.png', 'https://discord.gg/emeraldcity')
    .setDescription('Click the `Verify` button below to get the ' + `<@&${roleId}>` + ' role with your EmeraldID.')
    .setThumbnail('https://i.imgur.com/UgE8FJl.png');

  interaction.reply({ embeds: [embed], components: [row] }).catch(e => console.log(e));
}

module.exports = {
  name: 'groupverifier',
  description: 'setup a role verification with emeraldid',
  execute: execute,
}