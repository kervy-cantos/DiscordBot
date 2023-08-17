const supabase = require("../../database/connect");

const returnExp = async (userIds, monsterId) => {
  const { data: userData } = await supabase
    .from("Users")
    .select()
    .in("discordId", userIds);
  const monsterData = await supabase.from("Monsters").select().eq(monsterId);

  const newUserData = userData.map((d) => {
    return { id: d.id, currentExp: d.currentExp + 5 };
  });
  const res = await supabase.from("Users").upsert(newUserData).select("*");
  if (res && res.data != null) {
    for (let user of res.data) {
      const { maxExp, currentExp, discordId } = user;
      if (currentExp >= maxExp) {
        const extraExp = currentExp - maxExp;
        const response = await supabase
          .from("Users")
          .update({ currentExp: extraExp, maxExp: maxExp + 100 })
          .eq("discordId", discordId);
      }
    }
  }
};

module.exports = returnExp;
