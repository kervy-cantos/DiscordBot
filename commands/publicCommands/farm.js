const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const registerUser = require("../../utils/helperFunctions/checkUser");
const supabase = require("../../database/connect");
const returnExp = require("../../utils/helperFunctions/returnExp");

const embed = new EmbedBuilder();

module.exports = {
  name: "farm",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("farm")
    .setDescription("Just a test command"),
  async execute(interaction) {
    const monsterId = 1;
    const { status, userData } = await registerUser(interaction.member.id);
    const { data: battleLog } = await supabase
      .from("ActiveBattleLogs")
      .select()
      .eq("userId", interaction.member.id)
      .eq("monsterId", monsterId)
      .eq("isActive", true)
      .order("timeStamp", { ascending: false });

    let monsterData = [];
    await interaction.deferReply();
    if (status == true) {
      return interaction.editReply("You are not registered");
    }
    try {
      embed.data.fields = [];

      const { data: monsterData } = await supabase
        .from("Monsters")
        .select()
        .eq("id", monsterId);
      embed
        .setThumbnail(monsterData[0].imageUrl)
        .setTitle(monsterData[0].name)
        .addFields(
          { name: "LvL", value: String(monsterData[0].lvl), inline: true },
          {
            name: "Health",
            value:
              battleLog.length > 0
                ? String(battleLog[0]?.remainingHp)
                : String(monsterData[0].hp),
            inline: true,
          }
        )
        .setColor("Red");
      const message = await interaction.editReply({
        embeds: [embed],
        fetchReply: true,
      });
      const attackLogs = [];
      const fetchAttackersData = async (arr) => {
        const { data: attackersData } = await supabase
          .from("Users")
          .select()
          .in("discordId", arr);
        return attackersData;
      };
      await message.react("⚔️");

      const filter = (reaction, user) => {
        return reaction.emoji.name === "⚔️";
      };

      return message
        .awaitReactions({ filter, time: 10000 })
        .then(async (collected) => {
          const reaction = collected.first();

          if (reaction) {
            const attackers = reaction.users.cache.filter(
              (user) => user.bot != true
            );
            const attackerIds = attackers.map((d) => d.id);
            const attackersData = await fetchAttackersData(attackerIds);

            let monsterHp =
              battleLog.length > 0
                ? battleLog[0]?.remainingHp
                : monsterData[0].hp;
            attackersData.map(async (user) => {
              monsterHp -= user.maxDmg;
              embed.addFields({
                name: `Attackers:`,
                value: user.discordUserName,
                inline: false,
              });
            });

            interaction.editReply({ embeds: [embed], ephemeral: true });
            const logs = {
              monsterId: monsterData[0].id,
              userId: interaction.member.id,
              remainingHp: monsterHp,
              isActive: monsterHp > 0 ?? false,
            };
            if (monsterHp == 0) {
              const newLogs = battleLog.map((log) => {
                return { ...log, isActive: false };
              });
              returnExp(attackerIds, monsterData[0].id);
              await supabase.from("ActiveBattleLogs").upsert(newLogs);
              embed.setFooter({
                text: "dead",
                iconURL: monsterData[0].imageUrl,
              });
              return message.reply({ embeds: [embed] });
            } else {
              return await supabase.from("ActiveBattleLogs").insert(logs);
            }
          }
          message.reactions.removeAll();
        })
        .catch((collected) => {
          console.log(collected);
          message.reactions.removeAll();
        });
    } catch (error) {
      console.log(error);
    }
  },
};
