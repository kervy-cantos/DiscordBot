const { SlashCommandBuilder, Embed, EmbedBuilder } = require("discord.js");
const supabase = require("../../database/connect");
const registerUser = require("../../utils/helperFunctions/checkUser");

const embed = new EmbedBuilder();

module.exports = {
  name: "start",
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Just a test command"),
  async execute(interaction) {
    await interaction.deferReply();
    const checkIfRegistered = await registerUser(interaction.member.id);
    const profilePic = interaction.member.displayAvatarURL();

    if (checkIfRegistered.status == true) {
      let userData = {
        discordId: interaction.member.id,
        discordNickName: interaction.member.displayName,
        discordUserName: interaction.member.user?.username,
      };

      const response = await supabase.from("Users").insert(userData);

      embed
        .setColor("DarkPurple")
        .setTitle(`Welcome ${interaction.member.displayName}`);
      interaction.editReply({ embeds: [embed] });
    } else {
      console.log(checkIfRegistered.userData)
      embed
        .setTitle("Hello " + interaction.member.displayName)
        .setColor("Red")
        .setDescription("You are already registered")
        .setThumbnail(profilePic)
        .setTimestamp();
      interaction.editReply({ embeds: [embed] });
    }
  },
};
