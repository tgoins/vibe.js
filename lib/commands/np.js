const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');

module.exports = new Command({
  name: 'np',
  description: 'Displays the current song',
  parameters: [],
  fn: (msg, params) => {
    var response = "Now playing: ";
      if(BotState.isPlaying()) {
        response += "\"" + BotState.nowPlaying["title"] + "\" (requested by " + BotState.nowPlaying["user"] + ")";
      } else {
        response += "nothing!";
      }

      msg.reply(response).then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
  }
});
