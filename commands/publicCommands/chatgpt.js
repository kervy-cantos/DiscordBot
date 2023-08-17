const { SlashCommandBuilder, SlashCommandStringOption } = require("discord.js");
const dotenv = require("dotenv").config();

const { CHATGPT_KEY } = process.env;
let timeouts = [];

module.exports = {
  name: "chatgpt",
  data: new SlashCommandBuilder()
    .setName("chatgpt")
    .setDescription("Allows you to use chatgpt")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Do what u want")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (timeouts.includes(true)) {
      return await interaction.reply("```Command on cooldown```");
    }
    timeouts.push(true);

    setTimeout(() => {
      timeouts = [];
    }, 30000);
    const message = interaction.options.getString("message");
    await interaction.deferReply();
    let body = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${CHATGPT_KEY}`,
      },
      body: JSON.stringify(body),
    });
    const res = await response.json();
    await interaction.editReply(res.choices[0].message.content);
  },
};
