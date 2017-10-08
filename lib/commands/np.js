const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');

module.exports = new Command({
  name: 'np',
  description: 'Displays the current song',
  parameters: [],
  fn: (msg, params) => {
    var response = "Now playing: ";
      if(is_bot_playing()) {
        response += "\"" + now_playing_data["title"] + "\" (requested by " + now_playing_data["user"] + ")";
      } else {
        response += "nothing!";
      }

      msg.reply(response);
  }
});
