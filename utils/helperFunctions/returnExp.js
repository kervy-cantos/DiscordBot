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
  const res = await supabase
    .from("Users")
    .upsert(newUserData)
    .select(`*, lvl("*")`);
  if (res && res.data != null) {
    console.log(res.data);
    for (let user of res.data) {
      const { currentExp, discordId } = user;
      const { nextExp, id } = user.lvl;
      if (currentExp >= nextExp) {
        let newExp = currentExp - nextExp;
        let newLevel = Number(id) + 1;
        console.log(newLevel);
        console.log(newExp);
        const data = await supabase
          .from("Users")
          .update({ currentExp: newExp, lvl: newLevel })
          .eq("discordId", discordId)
          .select();
      }
    }
  }
};

module.exports = returnExp;
