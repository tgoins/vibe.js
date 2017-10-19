const Command = require('./command')
const MusicPlayer = require('../musicPlayer')
const validUrl = require('valid-url')
const search = require('youtube-search')
const cfg = require('../../config.js')

module.exports = new Command({
  name: 'play',
  description: 'Adds the requested video to the playlist queue',
  parameters: ['video URL, video ID, or playlist URL'],
  aliases: ['add', 'p'],
  requiresVoiceChannel: true,
  fn: (msg, params) => {
    if (validUrl.isUri(params[1])) {
      const regExp = /^.*(youtu.be\/|list=)([^#&?]*).*/
      const match = params[1].match(regExp)

      if (match && match[2]) {
        return MusicPlayer.queuePlaylist(match[2], msg)
      }
      return MusicPlayer.addToQueue(params[1], msg)
    }

    search(
      params.join(' ').substring(params.join(' ').indexOf(' ')) + (Boolean(cfg.karaokeModeEnabled) ? ' karaoke' : ''),
      MusicPlayer.youtubeSearchOptions,
      function (err, results) {
        if (err) return console.log(err)

        return MusicPlayer.addToQueue(results[0].link, msg)
      }
    )
  }
})
