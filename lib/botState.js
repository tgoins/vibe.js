class BotState {
	constructor() {
		this.stopped = false;
		this.informNowplaying = true;
		this.nowPlaying = {};
		this.queue = [];
		this.aliases = {};
		this.voiceConnection = null;
		this.voiceHandler = null;
		this.textChannel = null;
		this.requiredRole = null;
		this.isQueueEmpty = () => (!this.queue[0] || this.queue.length === 0);
		this.isPlaying = () => this.voiceHandler !== null;
	}
}

module.exports = (new BotState);