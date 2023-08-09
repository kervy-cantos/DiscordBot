const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const registerUser = require("../../utils/helperFunctions/checkUser");

const embed = new EmbedBuilder();
module.exports = {
  name: "profile",
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Just a test command"),
  async execute(interaction) {
    await interaction.deferReply();
    if (registerUser === true) {
      embed.setDescription("You are not yet registered.");
      interaction.editReply({ embeds: [embed] });
    }

    interaction.editReply({ embeds: [embed] });
  },
};
