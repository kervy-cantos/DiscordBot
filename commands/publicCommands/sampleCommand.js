const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "test",
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Just a test command"),
  async execute(interaction) {
    await interaction.reply("Just a test command");
  },
};
