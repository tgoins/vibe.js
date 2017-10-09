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
    const purgeMessages = () => {
      msg.channel.fetchMessages({limit: 100}).then(messages => {
        var count = messages.length;
        msg.channel.bulkDelete(messages);

        if(count === 100) {
          setTimeout(() => purgeMessages(), 1000);
        }
      });
    }
    purgeMessages();
  }
});
