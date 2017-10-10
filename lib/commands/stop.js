const Command = require('./command');
const BotState = require('../botState');
const cfg = require('../../config.js');
const autoDeleteMessage = cfg.deleteAfterReply.enabled;
const autoDeleteMessageDelay = cfg.deleteAfterReply.time;

module.exports = new Command({
  name: 'stop',
  description: 'Stops playlist (will also skip current song!)',
  parameters: [],
  disabled: true,
  fn: (msg, params) => {
    if(BotState.stopped) {
      msg.reply('Playback is already stopped!').then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
    } else {
      BotState.stopped = true;
      if(BotState.voiceHandler !== null) {
        BotState.voiceHandler.end();
        BotState.voiceChannel.leave();
      }
      msg.reply("Stopping!").then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
    }
  }
});
