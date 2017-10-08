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
	}
}

module.exports = (new BotState);