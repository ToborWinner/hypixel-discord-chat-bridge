const { Client, Collection, AttachmentBuilder, GatewayIntentBits } = require("discord.js");
const CommunicationBridge = require("../contracts/CommunicationBridge.js");
const { replaceVariables } = require("../contracts/helperFunctions.js");
const messageToImage = require("../contracts/messageToImage.js");
const MessageHandler = require("./handlers/MessageHandler.js");
const StateHandler = require("./handlers/StateHandler.js");
const CommandHandler = require("./CommandHandler.js");
const config = require("../Configuration.js");
const fs = require("fs");
const path = require("path");
const { ErrorEmbed } = require("../contracts/embedHandler.js");

class DiscordManager extends CommunicationBridge {
  constructor(app) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.commandHandler = new CommandHandler(this);
  }

  connect() {
    global.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
    });

    this.client = client;

    this.client.on("ready", () => this.stateHandler.onReady());
    this.client.on("messageCreate", (message) => this.messageHandler.onMessage(message));

    this.client.login(config.discord.bot.token).catch((error) => {
      console.error(error);
    });

    client.commands = new Collection();
    const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      if (command.verificationCommand === true && config.verification.enabled === false) {
        continue;
      }

      client.commands.set(command.name, command);
    }

    const eventFiles = fs.readdirSync(path.join(__dirname, "events")).filter((file) => file.endsWith(".js"));
    for (const file of eventFiles) {
      const event = require(`./events/${file}`);
      event.once ? client.once(event.name, (...args) => event.execute(...args)) : client.on(event.name, (...args) => event.execute(...args));
    }

    process.on("SIGINT", async () => {
      await this.stateHandler.onClose();

      process.kill(process.pid, "SIGTERM");
    });
  }

  async getWebhook(discord, type) {
    const channel = await this.stateHandler.getChannel(type);
    try {
      const webhooks = await channel.fetchWebhooks();

      if (webhooks.size === 0) {
        channel.createWebhook({
          name: "Hypixel Chat Bridge",
          avatar: "https://imgur.com/tgwQJTX.png"
        });

        await this.getWebhook(discord, type);
      }

      return webhooks.first();
    } catch (error) {
      console.log(error);
      channel.send({
        embeds: [new ErrorEmbed("An error occurred while trying to fetch the webhooks. Please make sure the bot has the `MANAGE_WEBHOOKS` permission.")]
      });
    }
  }

  async onBroadcast({ fullMessage, chat, chatType, username, rank, guildRank, message, color = 1752220 }) {
    if ((chat === undefined && chatType !== "debugChannel") || ((username === undefined || message === undefined) && chat !== "debugChannel")) {
      return;
    }

    const mode = chat === "debugChannel" ? "text" : config.discord.other.messageMode.toLowerCase();
    message = chat === "debugChannel" ? fullMessage : message;
    if (message !== undefined && chat !== "debugChannel") {
      console.broadcast(`${username} [${guildRank.replace(/§[0-9a-fk-or]/g, "").replace(/^\[|\]$/g, "")}]: ${message}`, `Discord`);
    }

    // ? custom message format (config.discord.other.messageFormat)
    if (config.discord.other.messageMode === "minecraft" && chat !== "debugChannel") {
      message = replaceVariables(config.discord.other.messageFormat, { chatType, username, rank, guildRank, message });
    }

    const channel = await this.stateHandler.getChannel(chat || "Guild");
    if (channel === undefined) {
      console.error(`Channel ${chat} not found!`);
      return;
    }

    switch (mode) {
      case "bot":
        await channel.send({
          embeds: [
            {
              description: message,
              color: this.hexToDec(color),
              timestamp: new Date(),
              footer: {
                text: guildRank
              },
              author: {
                name: username,
                icon_url: `https://www.mc-heads.net/avatar/${username}`
              }
            }
          ]
        });

        if (message.includes("https://")) {
          const links = message.match(/https?:\/\/[^\s]+/g).join("\n");

          channel.send(links);
        }

        break;

      case "text":
        await channel.send({
          content: message
        });
        break;

      case "webhook":
        message = this.cleanMessage(message);
        if (message.length === 0) {
          return;
        }

        this.app.discord.webhook = await this.getWebhook(this.app.discord, chatType);
        if (this.app.discord.webhook === undefined) {
          return;
        }

        this.app.discord.webhook.send({
          content: message,
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`
        });
        break;

      case "minecraft":
        if (fullMessage.length === 0) {
          return;
        }

        await channel.send({
          files: [
            new AttachmentBuilder(await messageToImage(message, username), {
              name: `${username}.png`
            })
          ]
        });

        if (message.includes("https://")) {
          const links = message.match(/https?:\/\/[^\s]+/g).join("\n");

          channel.send(links);
        }
        break;

      default:
        throw new Error("Invalid message mode: must be bot, webhook or minecraft");
    }
  }

  async onBroadcastCleanEmbed({ message, color, channel }) {
    console.broadcast(message, "Event");

    channel = await this.stateHandler.getChannel(channel);
    if (channel === undefined) {
      console.log(`Channel ${channel} not found!`);
    }

    channel.send({
      embeds: [
        {
          color: color,
          description: message
        }
      ]
    });
  }

  async onBroadcastHeadedEmbed({ message, title, icon, color, channel }) {
    console.broadcast(message, "Event");

    channel = await this.stateHandler.getChannel(channel);
    if (channel === undefined) {
      console.log(`Channel ${channel} not found!`);
      return;
    }

    channel.send({
      embeds: [
        {
          color: color,
          author: {
            name: title,
            icon_url: icon
          },
          description: message
        }
      ]
    });
  }

  async onPlayerToggle({ fullMessage, username, message, color, channel }) {
    console.broadcast(message, "Event");

    channel = await this.stateHandler.getChannel(channel);
    if (channel === undefined) {
      console.log(`Channel ${channel} not found!`);
      return;
    }

    switch (config.discord.other.messageMode.toLowerCase()) {
      case "bot":
        channel.send({
          embeds: [
            {
              color: color,
              timestamp: new Date(),
              author: {
                name: `${message}`,
                icon_url: `https://www.mc-heads.net/avatar/${username}`
              }
            }
          ]
        });
        break;
      case "webhook":
        message = this.cleanMessage(message);
        if (message.length === 0) {
          return;
        }

        this.app.discord.webhook = await this.getWebhook(this.app.discord, "Guild");
        if (this.app.discord.webhook === undefined) {
          return;
        }

        this.app.discord.webhook.send({
          username: username,
          avatarURL: `https://www.mc-heads.net/avatar/${username}`,
          embeds: [
            {
              color: color,
              description: `${message}`
            }
          ]
        });

        break;
      case "minecraft":
        await channel.send({
          files: [
            new AttachmentBuilder(await messageToImage(fullMessage), {
              name: `${username}.png`
            })
          ]
        });
        break;
      default:
        throw new Error("Invalid message mode: must be bot or webhook");
    }
  }

  hexToDec(hex) {
    if (hex === undefined) {
      return 1752220;
    }

    if (typeof hex === "number") {
      return hex;
    }

    return parseInt(hex.replace("#", ""), 16);
  }

  cleanMessage(message) {
    if (message === undefined) {
      return "";
    }

    return message
      .split("\n")
      .map((part) => {
        part = part.trim();
        return part.length === 0 ? "" : part.replace(/@(everyone|here)/gi, "").trim() + " ";
      })
      .join("");
  }

  formatMessage(message, data) {
    return replaceVariables(message, data);
  }
}

module.exports = DiscordManager;
