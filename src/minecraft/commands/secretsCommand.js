const minecraftCommand = require("../../contracts/minecraftCommand.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");

class SecretsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "secrets";
    this.aliases = ["dungeonsecrets"];
    this.description = "Skyblock Secrets of specified user across all profiles.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await hypixel.getPlayer(username);
      const achievements = data.achievements;
      const secrets = achievements.skyblockTreasureHunter || 0;

      this.send(`/gc ${username}'s Total Secrets Across All Profiles: ${secrets}`);
    } catch (error) {
      console.log(error);

      this.send(`/gc There was an error, please contact ToborWinner`);
    }
  }
}

module.exports = SecretsCommand;
