const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');

module.exports = new Command({
  name: 'request',
  description: 'Adds the requested video to the playlist queue',
  parameters: ["video URL, video ID, playlist URL or alias"],
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
