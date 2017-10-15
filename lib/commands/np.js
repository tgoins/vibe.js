const Command = require('./command')
const BotState = require('../botState')
const cfg = require('../../config.js')
const autoDeleteMessage = cfg.deleteAfterReply.enabled
const autoDeleteMessageDelay = cfg.deleteAfterReply.time

module.exports = new Command({
  name: 'np',
  description: 'Displays the current song',
  parameters: [],
  fn: (msg) => {
    if (BotState.isPlaying()) {
      let embed = {
        title: ' ',
        color: 0x2196f3,
        author: {
          name: 'Now playing: ' + BotState.nowPlaying.title,
          icon_url: 'https://img.youtube.com/vi/' + BotState.nowPlaying.id + '/hqdefault.jpg'
        },
        thumbnail: {
          url: 'https://img.youtube.com/vi/' + BotState.nowPlaying.id + '/hqdefault.jpg'
        },
        fields: [
          {
            name: 'Link',
            value: '[Click Here](' + 'https://www.youtube.com/watch?v=' + BotState.nowPlaying.id + ')',
            inline: true
          },
          {
            name: 'Requested By',
            value: BotState.nowPlaying.user,
            inline: true
          }
        ],
        footer: {
          text: 'Vibe.js | The joy of music.'
        }
      }

      if(BotState.queue.length > 0) {
        embed.fields.push({
          name: 'Up Next',
          value: BotState.queue[0].title
        })
      }

      return msg.reply({embed}).then(m => {
        if (autoDeleteMessage) {
          setTimeout(() => m.delete(), autoDeleteMessageDelay)
        }
      })
    }

    const response = 'Nothing is currently playing.'

    msg.reply(response).then(m => {
      if (autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay)
      }
    })
  }
})
