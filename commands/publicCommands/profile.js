const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const registerUser = require("../../utils/helperFunctions/checkUser");
const { AttachmentBuilder } = require("discord.js");
const nodeHtmlToImage = require("node-html-to-image");
const supabase = require("../../database/connect");

const embed = new EmbedBuilder();
module.exports = {
  name: "profile",
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Just a test command"),
  async execute(interaction) {
    await interaction.deferReply();
    const { status, userData } = await registerUser(interaction.member.id);
    if (status == true) {
      embed.setDescription("You are not yet registered.");
      interaction.editReply({ embeds: [embed] });
    } else {
      const _htmlTemplate = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <style>
          body {
            font-family: "Poppins", Arial, Helvetica, sans-serif;
            background: rgb(31, 31, 31);
            color: #fff;
            max-width: 430px;
          }
    
          .app {
            width: 80%;
            padding: 20px;
            display: flex;
            flex-direction: row;
            justify-content:space-between;
            border-top: 3px solid rgb(16, 180, 209);
            background: rgb(31, 31, 31);
            align-items: center;
          }
    
          img {
            width: 50px;
            height: 50px;
            margin-right: 20px;
            border-radius: 50%;
            border: 1px solid #fff;
            padding: 5px;
          }
          .lvl-text{
            margin-bottom: 0;
            font-size: 16px;
            font-style:bold;
          }
          .stats{
            padding: 20px;
          }
          table{
            margin: 10px 0 0 0
          }
          table th, table td{
            text-align: left;
            font-size: 12px
          }
        </style>
      </head>
      <body>
        <div class="app">
          <img src="${interaction.member.displayAvatarURL()}" />
          <h4>${interaction.member.displayName}</h4>
          <div> <p class="lvl-text">LVL ${userData[0]?.lvl}<br> ${
        userData[0].currentExp
      }/${userData[0]?.maxExp} (${
        (userData[0].currentExp / userData[0]?.maxExp) * 100
      }%)</p></div>
         
        </div>
        <div class="stats">
          <table>
            <head>
            </head>
            <body>
            <tr>
              <th>HP :</th><td> ${userData[0].hpRemain}/${userData[0].hp}</td>
            </tr>
            <tr>
              <th>DMG :</th><td>${userData[0].minDmg} - ${
        userData[0].maxDmg
      }</td>
            </tr>
            <tr>
              <th>EXP :</th><td>${userData[0].currentExp}</td>
            </tr>
            <tr>
            </body>
          </table>
        </div>

      </body>
    </html>`;

      const images = await nodeHtmlToImage({
        html: _htmlTemplate,
        quality: 100,
        type: "jpeg",
        puppeteerArgs: {
          args: ["--no-sandbox"],
        },
        encoding: "buffer",
      });

      interaction.editReply({ files: [images] });
    }
  },
};
