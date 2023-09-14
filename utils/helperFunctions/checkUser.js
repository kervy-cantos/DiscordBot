const supabase = require("../../database/connect");

const registerUser = async (memberId) => {
  const { data: user } = await supabase
    .from("Users")
    .select(`*, lvl("*")`)
    .eq("discordId", memberId);
  if (user.length == 0) {
    return { status: true, userData: {} };
  }

  return {
    status: false,
    userData: user.map((userdata) => {
      return {
        ...userdata,
        maxHp: userdata.lvl.maxHp,
        maxDmg: userdata.maxDmg + userdata.lvl.maxDmg,
        minDmg: userdata.minDmg + userdata.lvl.maxDmg,
        nextExp: userdata.lvl.nextExp,
        lvl: userdata.lvl.id,
      };
    }),
  };
};
module.exports = registerUser;
