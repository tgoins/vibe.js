const Command = require('./command')
const BotState = require('../botState')
const cfg = require('../../config.js')
const autoDeleteMessage = cfg.deleteAfterReply.enabled
const autoDeleteMessageDelay = cfg.deleteAfterReply.time

module.exports = new Command({
  name: 'upnext',
  description: 'Displays the next song',
  parameters: [],
  aliases: ['un', 'u'],
  fn: (msg) => {
    if (BotState.queue.length > 0) {
      let embed = {
        title: ' ',
        color: 0x2196f3,
        author: {
          name: 'Up next: ' + BotState.queue[0].title,
          icon_url: 'https://img.youtube.com/vi/' + BotState.queue[0].id + '/hqdefault.jpg'
        },
        thumbnail: {
          url: 'https://img.youtube.com/vi/' + BotState.queue[0].id + '/hqdefault.jpg'
        },
        fields: [
          {
            name: 'Link',
            value: '[Click Here](' + 'https://www.youtube.com/watch?v=' + BotState.queue[0].id + ')',
            inline: true
          },
          {
            name: 'Requested By',
            value: BotState.queue[0].user,
            inline: true
          }
        ],
        footer: {
          text: 'Vibe.js | The joy of music.'
        }
      }

      return msg.reply({embed}).then(m => {
        if (autoDeleteMessage) {
          setTimeout(() => m.delete(), autoDeleteMessageDelay)
        }
      })
    }

    const response = 'Nothing has been requested.'

    msg.reply(response).then(m => {
      if (autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay)
      }
    })
  }
})
