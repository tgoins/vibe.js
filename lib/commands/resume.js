const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');
const cfg = require('../../config.js');
const autoDeleteMessage = cfg.deleteAfterReply.enabled;
const autoDeleteMessageDelay = cfg.deleteAfterReply.time;

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
        msg.reply("Playback is already running").then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
      }
  }
});
