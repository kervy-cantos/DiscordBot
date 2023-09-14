const {
  SlashCommandBuilder,
  AttachmentBuilder,
  Attachment,
} = require("discord.js");

const image =
  "https://thumbs.dreamstime.com/z/running-horse-desert-18709594.jpg";
const attachment = new AttachmentBuilder(image);
module.exports = {
  name: "test",
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Just a test command"),
  async execute(interaction) {
    await interaction.reply({ content: `TEsting image`, files: [attachment] });
  },
};
