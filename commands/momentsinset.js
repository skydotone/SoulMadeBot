const { getMomentsInSet } = require('../flow/scripts/getMomentsInSet.js');

const execute = async (interaction, options) => {
  let topshot = await getMomentsInSet(options.getString('address'), options.getString('setname'));
  if (topshot.error) {
    interaction.reply({ ephemeral: true, content: topshot.message }).catch(e => console.log(e));
    return;
  }
  postTopShot(interaction, topshot);
}

const postTopShot = (interaction, topshot) => {
  let fields = [
    {
      name: "Moments owned",
      value: `${topshot.moments.length}/${topshot.setData.plays.length}`,
      inline: true
    },
    {
      name: 'Series',
      value: String(topshot.setData.series),
      inline: true
    }
  ];
  topshot.moments.forEach(moment => {
    fields.push([
      {
        name: `${moment.player}, Serial #${moment.serialNumber}`,
        value: `Type: ${moment.playCategory} | Team: ${moment.team}`,
        inline: false
      }
    ])
  })
  let embed = {
    color: '#5bc595',
    title: topshot.setData.name,
    url: `https://nbatopshot.com/`,
    author: {
      name: 'Emerald City',
      url: 'https://discord.gg/emeraldcity',
      iconURL: 'https://i.imgur.com/YbmTuuW.png'
    },
    description: 'Moments owned by ' + topshot.owner + ' in ' + topshot.setData.name,
    thumbnail: {
      url: 'https://i.imgur.com/DPmasa5.jpg',
    },
    fields,
  };

  interaction.reply({ embeds: [embed] }).catch(e => console.log(e));
}

module.exports = {
  name: 'momentsinset',
  description: 'display all the moments a user has from a topshot set',
  execute,
}