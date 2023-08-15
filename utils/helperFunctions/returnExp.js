const supabase = require("../../database/connect");

const returnExp = async (userIds, monsterId) => {
  console.log(userIds);
  const { data: userData } = await supabase
    .from("Users")
    .select()
    .in("discordId", userIds);
  const monsterData = await supabase.from("Monsters").select().eq(monsterId);
  console.log(userData);
  const newUserData = userData.map((d) => {
    return { id: d.id, currentExp: d.currentExp + 5 };
  });
  const res = await supabase.from("Users").upsert(newUserData).select("*");
  console.log(res);
};

module.exports = returnExp;
