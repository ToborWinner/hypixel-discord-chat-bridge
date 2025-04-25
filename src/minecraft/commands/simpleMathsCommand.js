const minecraftCommand = require("../../contracts/minecraftCommand.js");
const generate = require("../../utils/generate.js");
const answerStore = require("../../utils/answerStore.js");

class SimpleMathsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "simplemaths";
    this.aliases = ["sm"];
    this.description = "Solve the equation. Test your math skills!";
    this.options = [];
  }

  async onCommand(username, _) {
    try {
      const generated = generate();
      const question = generated[1];
      const answer = generated[2];
      answerStore.current = answer;
      this.send("/gc Integrate " + question + " with respect to x. Use !answer to check.");
    } catch (error) {
      this.send(`/gc ${username} [ERROR] Unfortunately there was an error, please contact ToborWinner.`);
    }
  }
}

module.exports = SimpleMathsCommand;
