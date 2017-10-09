const Command = require('./command');
const BotState = require('../botState');

module.exports = new Command({
  name: 'stop',
  description: 'Stops playlist (will also skip current song!)',
  parameters: [],
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
      }
      msg.reply("Stopping!").then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
    }
  }
});
