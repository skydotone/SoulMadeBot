const { checkEmeraldIDBatch } = require('../flow/scripts/checkEmeraldID.js');
const { MessageAttachment, Permissions } = require('discord.js');

const execute = async (interaction, options) => {
  if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    await interaction.deferReply({ ephemeral: true });
    const channel = options.getChannel('channel');
    const membersInChannel = channel.members.map(member => member.id);

    sendInfo(interaction, membersInChannel);
  }
}

const sendInfo = async (interaction, membersInChannel) => {
  const answer = await checkEmeraldIDBatch(membersInChannel);

  const csv = csvmaker(Object.values(answer));

  const userList = new MessageAttachment(Buffer.from(csv), 'users.csv');
  await interaction.editReply({ content: `People currently in the discord channel:`, files: [userList] });
}

const csvmaker = function (data) {
  return data.join(',')
}

module.exports = {
  name: 'indiscord',
  description: 'show all the people currently in a discord channel',
  execute,
}