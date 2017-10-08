const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');

module.exports = new Command({
  name: 'search',
  description: 'Searches for a video on YouTube and adds it to the queue',
  parameters: ['query'],
  fn: (msg, params) => {
    if(aliases.hasOwnProperty(params[1].toLowerCase())) {
        params[1] = aliases[params[1].toLowerCase()];
      }

      var regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
      var match = params[1].match(regExp);

      if (match && match[2]){
          MusicPlayer.queuePlaylist(match[2], message);
      } else {
          MusicPlayer.addToQueue(params[1], message);
      }
  }
});
