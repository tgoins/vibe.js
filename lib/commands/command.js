export default class Command {
	constructor(command) {
		this.name = command.name;
		this.description = command.description;
		this.parameters = command.parameters;
		this.fn = command.fn;
	}
}