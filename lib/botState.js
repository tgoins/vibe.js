/**
 * Holds the bot's state. Contains any properties that may be important for when a command is executed, that can change.
 */
class BotState {
  constructor () {
    this.stopped = false
    this.informNowplaying = true
    this.nowPlaying = {}
    this.queue = []
    this.aliases = {}
    this.voiceConnection = null
    this.voiceHandler = null
    this.textChannel = null
    this.voiceChannel = null
    this.requiredRole = null
    this.isQueueEmpty = () => !this.queue[0] || this.queue.length === 0
    this.isPlaying = () => this.voiceHandler !== null
  }
}

/**
 * Singleton to prevent multiple instances of the BotState from being instantiated.
 * @type {BotState}
 */
module.exports = new BotState()
