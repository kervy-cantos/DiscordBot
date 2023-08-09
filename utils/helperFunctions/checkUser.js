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
module.exports = registerUser;
