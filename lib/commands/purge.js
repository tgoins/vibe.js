const Command = require('./command')

module.exports = new Command({
  name: 'purge',
  description: 'Purges the entire channel. May take a bit',
  parameters: [],
  disabled: true,
  fn: (msg) => {
    const purgeMessages = () => {
      msg.channel.fetchMessages({limit: 100}).then(messages => {
        var count = messages.length
        msg.channel.bulkDelete(messages)

        if (count === 100) {
          setTimeout(() => purgeMessages(), 1000)
        }
      })
    }
    purgeMessages()
  }
})
