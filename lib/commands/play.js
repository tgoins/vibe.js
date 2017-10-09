const Command = require('./command');
const BotState = require('../botState');
const MusicPlayer = require('../musicPlayer');
const validUrl = require('valid-url');
const search = require('youtube-search');

module.exports = new Command({
  name: 'play',
  description: 'Adds the requested video to the playlist queue',
  parameters: ["video URL, video ID, playlist URL or alias"],
  fn: (msg, params) => {
    if(validUrl.isUri(params[1])) {
      var regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
      var match = params[1].match(regExp);

      if (match && match[2]){
          return MusicPlayer.queuePlaylist(match[2], msg);
      } else {
          return MusicPlayer.addToQueue(params[1], msg);
      }
    }

    search(params.join(' ').substring(params.join(' ').indexof(' ')), MusicPlayer.youtubeSearchOptions, function(err, results) {
      if(err) return console.log(err);
     
      console.dir(results);
    });
  }
});
