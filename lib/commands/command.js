module.exports = class Command {
	constructor(command) {
		this.name = command.name;
		this.description = command.description;
		this.parameters = command.parameters;
		this.disabled = false;
		this.fn = command.fn;
	}
}