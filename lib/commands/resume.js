const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');

module.exports = new Command({
  name: 'resume',
  description: 'Resumes playlist',
  parameters: [],
  fn: (msg, params) => {
    if(BotState.stopped) {
        BotState.stopped = false;
        if(!BotState.isQueueEmpty()) {
          MusicPlayer.playNextSong();
        }
      } else {
        message.reply("Playback is already running");
      }
  }
});
