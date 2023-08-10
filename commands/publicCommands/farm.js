const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const registerUser = require("../../utils/helperFunctions/checkUser");
const supabase = require("../../database/connect");

const embed = new EmbedBuilder();

module.exports = {
  name: "farm",
  data: new SlashCommandBuilder()
    .setName("farm")
    .setDescription("Just a test command"),
  async execute(interaction) {
    const monsterId = 1;
    const { status, userData } = await registerUser(interaction.member.id);
    if (status == true) {
      return interaction.editReply("You are not registered");
    }
    try {
      await interaction.deferReply();
      const { data: monsterData } = await supabase
        .from("Monsters")
        .select()
        .eq("id", monsterId);
      embed
        .setThumbnail(monsterData[0].imageUrl)
        .setTitle(monsterData[0].name)
        .addFields(
          { name: "LvL", value: String(monsterData[0].lvl), inline: true },
          { name: "Health", value: String(monsterData[0].hp), inline: true }
        )
        .setColor("Red");
      const message = await interaction.editReply({
        embeds: [embed],
        fetchReply: true,
      });
      message.react("⚔️");
      const filter = (reaction, user) => {
        return (
          reaction.emoji.name === "⚔️" &&
          user.id != interaction.client.application.id
        );
      };

      return message
        .awaitReactions({ filter, max: 1, time: 10000, errors: ["time"] })
        .then((collected) => {
          embed.setFooter({
            text: `You attacked ${monsterData[0].name}`,
            iconURL: `${monsterData[0].imageUrl}`,
          });
          interaction.editReply({ embeds: [embed], ephemeral: true });
          message.reactions.removeAll();
        })
        .catch((collected) => {
          console.log("no reactions");
        });
    } catch (error) {
      console.log(error);
    }
  },
};
