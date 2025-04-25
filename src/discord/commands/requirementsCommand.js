const { formatUsername, formatNumber } = require("../../contracts/helperFunctions.js");
const getWeight = require("../../../API/stats/weight.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const config = require("../../../config.json");

module.exports = {
  name: "requirements",
  description: "Checks if the user meets the requirements to join the guild.",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true
    }
  ],

  execute: async (interaction) => {
    try {
      let passed = false;
      for (const role of config.requirements.allowedRoles) {
        if (interaction.member.roles.cache.some((a) => a.id == role)) {
          passed = true;
          break;
        }
      }
      if (!passed) {
        await interaction.followUp({
          embeds: [
            {
              title: "You don't have the required permission to run this command",
              color: 0xff0000
            }
          ]
        });
        return;
      }

      let username = interaction.options.getString("name");
      let data;
      try {
        data = await getLatestProfile(username);
      } catch (e) {
        if (e.toString() == "Invalid username.") {
          await interaction.followUp({
            embeds: [
              {
                title: `Player with username "${username}" not found.`,
                color: 0xff0000
              }
            ]
          });
        } else {
          await interaction.followUp({
            embeds: [
              {
                title: `Unfortunately there was an error, please contact ToborWinner.`,
                color: 0xff0000
              }
            ]
          });
        }
        return;
      }

      username = formatUsername(username, data.profileData?.game_mode);

      const experience = data.profile.leveling?.experience ?? 0;
      const level = experience / 100;

      const profile = getWeight(data.profile, data.uuid);
      const senitherW = profile.senither.total;

      const meetsLevelHigh = level >= config.requirements.highLevel;
      const meetsWeightHigh = senitherW >= config.requirements.highWeight;
      const meetsOneHigh = meetsLevelHigh || meetsWeightHigh;

      const meetsLow = level >= config.requirements.lowLevel;

      const embedHigh = {
        title: `${config.requirements.nameHigh} - Requirements for ${username}`,
        description: `${meetsOneHigh ? ":white_check_mark: Requirements met." : ":x: Requirements not met."}\n\n**Level:** ${meetsLevelHigh ? ":white_check_mark:" : ":x:"} \`${level}\`\n**Weight:** ${meetsWeightHigh ? ":white_check_mark:" : ":x:"} \`${formatNumber(senitherW)}\``,
        color: meetsOneHigh ? 0x00ff00 : 0xff0000
      };

      const embedLow = {
        title: `${config.requirements.nameLow} - Requirements for ${username}`,
        description: `${meetsLow ? ":white_check_mark: Requirements met." : ":x: Requirements not met."}\n\n**Level:** ${meetsLow ? ":white_check_mark:" : ":x:"} \`${level}\``,
        color: meetsLow ? 0x00ff00 : 0xff0000
      };

      await interaction.followUp({
        embeds: [embedLow, embedHigh]
      });
    } catch (e) {
      console.log(e);
      try {
        await interaction.followUp({
          embeds: [
            {
              title: "Unfortunately there was an error. Please contact ToborWinner.",
              color: 0xff0000
            }
          ]
        });
      } catch (e2) {
        console.log(e2);
      }
    }
  }
};
