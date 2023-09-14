const { Events, Collection } = require("discord.js");
const registerUser = require("../utils/helperFunctions/checkUser");
const supabase = require("../database/connect");

const image =
  "https://thumbs.dreamstime.com/z/running-horse-desert-18709594.jpg";
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const { status, userData } = await registerUser(message.author.id);

    if (status == true) return;
    if (userData[0].hpRemain < userData[0].maxHp) {
      const { error } = await supabase
        .from("Users")
        .update({ hpRemain: (userData[0].hpRemain += 1) })
        .eq("discordId", message.author.id);
      if (!error) console.log("healed");
    }
  },
};
