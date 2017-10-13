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
    var response = 'Now playing: '
    if (BotState.isPlaying()) {
      response +=
        '"' +
        BotState.nowPlaying.title +
        '" (requested by ' +
        BotState.nowPlaying.user +
        ')'
    } else {
      response += 'nothing!'
    }

    msg.reply(response).then(m => {
      if (autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay)
      }
    })
  }
})
