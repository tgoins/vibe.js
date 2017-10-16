const Command = require('./command')
const cfg = require('../../config.js')
const autoDeleteMessage = cfg.deleteAfterReply.enabled
const autoDeleteMessageDelay = cfg.deleteAfterReply.time

module.exports = new Command({
  name: 'karaoke',
  description: 'Enable or disable karaoke mode. If enabled will make any searched song return its karaoke version',
  parameters: [],
  aliases: ['k'],
  fn: (msg) => {
    cfg.karaokeModeEnabled = !Boolean(cfg.karaokeModeEnabled);

    const response = `Karaoke mode has been ${cfg.karaokeModeEnabled ? 'en' : 'dis'}abled`

    msg.reply(response).then(m => {
      if (autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay)
      }
    })
  }
})
