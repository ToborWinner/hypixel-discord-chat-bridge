const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatNumber, formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const getWeight = require("../../../API/stats/weight.js");
const config = require("../../../config.json");

class MemberStatusCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = config.memberStatus.name;
    this.aliases = config.memberStatus.aliases;
    this.description = "Returns whether someone is a member of DS or not.";
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
      const uuid = await getUUID(username);

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const experience = data.profile.leveling?.experience ?? 0;

      const profile = getWeight(data.profile, data.uuid);

      const senitherWeight = formatNumber(profile.senither.total);

      const hypixelGuild = await hypixel.getGuild("player", bot.username);
      const guildMembers = hypixelGuild.getMemberUUIDMap();
      const member = guildMembers.get(uuid);
      const inGuild = member != undefined;

      this.send(
        `/gc ${username}'s Level: ${experience ? experience / 100 : 0} | Weight: ${senitherWeight} | In ${hypixelGuild.name}: ${inGuild}` +
          (inGuild ? ` | Rank: ${member.rank}` : "")
      );
    } catch (error) {
      console.log(error);

      this.send(`/gc [ERROR] There was an error, please contact ToborWinner.`);
    }
  }
}

module.exports = MemberStatusCommand;
