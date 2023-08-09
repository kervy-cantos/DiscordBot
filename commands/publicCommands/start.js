const { SlashCommandBuilder, Embed, EmbedBuilder } = require("discord.js");
const supabase = require("../../database/connect");

const registerUser = async (memberId) => {
  const { data: user } = await supabase
    .from("Users")
    .select("*")
    .eq("discordId", memberId);
  if (user.length == 0) {
    return true;
  }
  return false;
};

const embed = new EmbedBuilder();

module.exports = {
  name: "start",
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Just a test command"),
  async execute(interaction) {
    await interaction.deferReply();
    const checkIfRegistered = registerUser(interaction.member.id);
    const profilePic = interaction.member.displayAvatarURL();

    if (checkIfRegistered == true) {
      let userData = {
        discordId: interaction.member.id,
        discordNickName: interaction.member.displayName,
        discordUserName: interaction.member.user?.username,
      };

      const response = await supabase.from("Users").insert(userData);
      console.log(response);
      embed.setColor("DarkPurple").setDescription("Welcome");
      interaction.editReply({ embeds: [embed] });
    } else {
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
