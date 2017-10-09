const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');
const cfg = require('../../config.js');
const autoDeleteMessage = cfg.deleteAfterReply.enabled;
const autoDeleteMessageDelay = cfg.deleteAfterReply.time;

module.exports = new Command({
  name: 'purge',
  description: 'Purges the entire channel. May take a bit',
  parameters: [],
  fn: (msg, params) => {
    let fetched = message.channel.fetchMessages({count: 100});
    while(fetched.length > 0) {
      msg.channel.bulkDelete(fetched)
      .catch(err => console.log(err));

      fetched = message.channel.fetchMessages({count: 100});
    }
  }
});
