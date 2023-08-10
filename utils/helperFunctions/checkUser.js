const supabase = require("../../database/connect");

const registerUser = async (memberId) => {
  const { data: user } = await supabase
    .from("Users")
    .select()
    .eq("discordId", memberId);
  if (user.length == 0) {
    return { status: true, userData: {} };
  }
  return { status: false, userData: user };
};
module.exports = registerUser;
