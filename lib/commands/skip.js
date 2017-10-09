const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');
const cfg = require('../../config.js');
const autoDeleteMessage = cfg.deleteAfterReply.enabled;
const autoDeleteMessageDelay = cfg.deleteAfterReply.time;

module.exports = new Command({
  name: 'skip',
  description: 'Skips the current song',
  parameters: [],
  fn: (msg, params) => {
    if(BotState.voiceHandler) {
      msg.reply('Skipping...').then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
      BotState.voiceHandler.destroy();
    } else {
      msg.reply('There is nothing being played.').then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
    }
  }
});
