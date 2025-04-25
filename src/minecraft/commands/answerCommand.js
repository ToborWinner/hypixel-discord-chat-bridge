const minecraftCommand = require("../../contracts/minecraftCommand.js");
const answerStore = require("../../utils/answerStore.js");

class AnswerCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "answer";
    this.aliases = [];
    this.description = "Send the answer to the last simple math question.";
    this.options = [];
  }

  async onCommand(username, _) {
    try {
      this.send("/gc Answer to the last question: " + answerStore.current);
    } catch (error) {
      this.send(`/gc ${username} [ERROR] Unfortunately there was an error, please contact ToborWinner.`);
    }
  }
}

module.exports = AnswerCommand;
