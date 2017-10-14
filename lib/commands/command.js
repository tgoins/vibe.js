/**
 * The command object that holds information about a bot command
 * @type {module.Command}
 */
module.exports = class Command {
  constructor (command) {
    /**
     * The name of the command. This is what the user will input.
     * @type {string}
     */
    this.name = command.name || ''
    /**
     * The description of the command.
     * @type {string}
     */
    this.description = command.description || ''
    /**
     * The parameters of the command.
     * @type {Array}
     */
    this.parameters = command.parameters || []
    /**
     * Specifies if command should be disabled. If true, will not be accessible to the user.
     * @type {boolean}
     */
    this.disabled = command.disabled || false
    /**
     * Command aliases. Allows the user to call the command using different names.
     * @type {Array}
     */
    this.aliases = command.aliases || []
    /**
     * Specifies whether the command needs to be in a voice channel to work.
     * @type {boolean}
     */
    this.requiresVoiceChannel = command.requiresVoiceChannel || false
    /**
     * The function that will be executed when the command is called.
     * @type {function}
     */
    this.fn = command.fn || null;
  }
}
