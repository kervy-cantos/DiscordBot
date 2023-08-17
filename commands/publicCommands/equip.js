const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "equip",
  data: new SlashCommandBuilder()
    .setName("equip")
    .setDescription("Command for equip"),

  async execute(interaction) {
    await interaction.reply("Test");
  },
};
