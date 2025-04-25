const config = require("../../Configuration.js");

module.exports = {
  name: `accept-${config.accept.suffix}`,
  description: "Invites the given user to the guild.",
  requiresBot: true,
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
      for (const role of config.accept.allowedRoles) {
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

      const name = interaction.options.getString("name");
      bot.chat(`/g invite ${name}`);

      const embed = {
        description: `Your application has been accepted! Welcome to the guild.\n\nPlease run **/guild accept ${bot.username}** on Hypixel.\n*If you are offline, you will have 5 minutes to run the command upon logging on.*`,
        color: 0x00ff00
      };

      await interaction.followUp({
        embeds: [embed]
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
