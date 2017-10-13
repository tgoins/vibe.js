module.exports = class Command {
  constructor (command) {
    this.name = command.name
    this.description = command.description
    this.parameters = command.parameters || []
    this.disabled = command.disabled || false
    this.aliases = command.aliases || []
    this.fn = command.fn
  }
}
