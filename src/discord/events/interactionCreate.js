const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { ErrorEmbed, SuccessEmbed } = require("../../contracts/embedHandler.js");
// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const config = require("../../Configuration.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const memberRoles = interaction.member.roles.cache.map((role) => role.id);
        await interaction.deferReply({ ephemeral: false }).catch(() => {});
        if (memberRoles.some((role) => config.discord.commands.blacklistRoles.includes(role))) {
          throw new HypixelDiscordChatBridgeError("You are blacklisted from the bot.");
        }

        const command = interaction.client.commands.get(interaction.commandName);
        if (command === undefined) {
          return;
        }

        console.discord(`${interaction.user.username} - [${interaction.commandName}]`);

        if (command.verificationCommand === true && config.verification.enabled === false) {
          throw new HypixelDiscordChatBridgeError("Verification is disabled.");
        }

        if (command.channelsCommand === true && config.statsChannels.enabled === false) {
          throw new HypixelDiscordChatBridgeError("Channel Stats is disabled.");
        }

        if (command.moderatorOnly === true && isModerator(interaction) === false) {
          throw new HypixelDiscordChatBridgeError("You don't have permission to use this command.");
        }

        if (command.requiresBot === true && isBotOnline() === false) {
          throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
        }

        await command.execute(interaction);
      } else if (interaction.isButton()) {
        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        if (interaction.customId !== "joinRequestAccept") return;
        const username = interaction?.message?.embeds?.[0]?.title.split(" ")?.[0] || undefined;
        if (!username) throw new HypixelDiscordChatBridgeError("Something is missing");
        bot.chat(`/g accept ${username}`);
        const embed = new SuccessEmbed(`Successfully accepted **${username}** into the guild.`);

        await interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      const errrorMessage = error instanceof HypixelDiscordChatBridgeError ? "" : "Please try again later. The error has been sent to the Developers.\n\n";

      const errorEmbed = new ErrorEmbed(`${errrorMessage}\`\`\`${error}\`\`\``);

      await interaction.editReply({ embeds: [errorEmbed] });

      if (error instanceof HypixelDiscordChatBridgeError === false) {
        const username = interaction.user.username ?? interaction.user.tag ?? "Unknown";
        const commandOptions = JSON.stringify(interaction.options.data) ?? "Unknown";
        const commandName = interaction.commandName ?? "Unknown";
        const errorStack = error.stack ?? error ?? "Unknown";
        const userID = interaction.user.id ?? "Unknown";

        const errorLog = new ErrorEmbed(
          `Command: \`${commandName}\`\nOptions: \`${commandOptions}\`\nUser ID: \`${userID}\`\nUser: \`${username}\`\n\`\`\`${errorStack}\`\`\``
        );
        interaction.client.channels.cache.get(config.discord.channels.loggingChannel).send({
          content: `<@&${config.discord.commands.commandRole}>`,
          embeds: [errorLog]
        });
      }
    }
  }
};

function isBotOnline() {
  if (bot === undefined || bot._client.chat === undefined) {
    return false;
  }

  return true;
}

function isModerator(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (config.discord.commands.checkPerms === true && !(userRoles.includes(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))) {
    return false;
  }

  return true;
}
