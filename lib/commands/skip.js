const Command = require('./command')
const BotState = require('../botState')
const cfg = require('../../config.js')
const autoDeleteMessage = cfg.deleteAfterReply.enabled
const autoDeleteMessageDelay = cfg.deleteAfterReply.time

module.exports = new Command({
  name: 'skip',
  description: 'Skips the current song',
  parameters: [],
  requiresVoiceChannel: true,
  aliases: ['s', 'next'],
  fn: (msg) => {
    if (BotState.voiceHandler) {
      msg.reply('Skipping...').then(m => {
        if (autoDeleteMessage) {
          setTimeout(() => m.delete(), autoDeleteMessageDelay)
        }
      })
      BotState.voiceHandler.end()
      BotState.voiceHandler = null
    } else {
      msg.reply('There is nothing being played.').then(m => {
        if (autoDeleteMessage) {
          setTimeout(() => m.delete(), autoDeleteMessageDelay)
        }
      })
    }
  }
})
