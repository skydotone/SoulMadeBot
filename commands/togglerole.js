
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const execute = (interaction, options) => {
  const role = options.getRole('role');
  const description = options.getString('description');
  const image = options.getString('image');
  console.log(image);
  if (!description) {
    return;
  }
  getRole(interaction, role.id, description, image);
}

const getRole = (interaction, roleID, description, image) => {
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(`toggleARole-${roleID}-join`)
        .setLabel('Join')
        .setStyle('SUCCESS'),
      new MessageButton()
        .setCustomId(`toggleARole-${roleID}-leave`)
        .setLabel('Remove')
        .setStyle('SECONDARY'),
    );

  let embed;
  if (!image) {
    embed = new MessageEmbed()
      .setColor('#5bc595')
      .setTitle(description)
  } else {
    embed = new MessageEmbed()
      .setColor('#5bc595')
      .setTitle(description)
      .setThumbnail(image);
  }

  interaction.reply({ embeds: [embed], components: [row] }).catch(
    interaction.reply({ ephemeral: true, content: 'You did not pass a valid URL for the image.' })
  );
}

module.exports = {
  name: 'togglerole',
  description: 'get or remove a specific role',
  execute,
}