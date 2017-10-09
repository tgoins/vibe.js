const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');
const cfg = require('../../config.js');
const autoDeleteMessage = cfg.deleteAfterReply.enabled;
const autoDeleteMessageDelay = cfg.deleteAfterReply.time;

module.exports = new Command({
  name: 'queue',
  description: 'Lists the songs in the queue',
  parameters: [],
  fn: (msg, params) => {
    if(BotState.isQueueEmpty()) {
      return msg.reply('The queue is empty').then(m => {
        if(autoDeleteMessage) {
          setTimeout(() => m.delete(), autoDeleteMessageDelay);
        }
      });
    }

    let response = '```';
    const isQueueLong = BotState.queue.length > 30;
    for(let i = 0; i < (isQueueLong ? 30 : BotState.queue.length); i++) {
      response += "\"" + BotState.queue[i]["title"] + "\" (requested by " + BotState.queue[i]["user"] + ")\n";
    }

    if(isQueueLong) { 
      response += "\n**...and " + (BotState.queue.length - 30) + " more.**";
    }

    response += '```';

    msg.reply(response).then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
  }
});
