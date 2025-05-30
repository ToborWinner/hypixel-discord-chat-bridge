// eslint-disable-next-line import/extensions
const { Routes } = require("discord-api-types/v9");
const config = require("../Configuration.js");
const { REST } = require("@discordjs/rest");
const fs = require("fs");
const path = require("path");

class CommandHandler {
  constructor(discord) {
    this.discord = discord;

    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      if (command.verificationCommand === true && config.verification.enabled === false) {
        continue;
      }

      if (command.channelsCommand === true && config.statsChannels.enabled === false) {
        continue;
      }

      commands.push(command);
    }

    const rest = new REST({ version: "10" }).setToken(config.discord.bot.token);

    const clientID = Buffer.from(config.discord.bot.token.split(".")[0], "base64").toString("ascii");

    rest.put(Routes.applicationGuildCommands(clientID, config.discord.bot.serverID), { body: commands }).catch((e) => console.error(e));
  }
}

module.exports = CommandHandler;
