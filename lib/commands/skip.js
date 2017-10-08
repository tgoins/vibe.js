const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');

module.exports = new Command({
  name: 'skip',
  description: 'Skips the current song',
  parameters: [],
  fn: (msg, params) => {
    if(BotState.voiceHandler) {
      msg.reply('Skipping...');
      BotState.voiceHandler.end();
    } else {
      msg.reply('There is nothing being played.');
    }
  }
});