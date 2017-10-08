class MusicPlayer {
	constructor() {
		this.youTubeApiKey = null;
		this.setYoutubeKey = (key) => {
			this.youTubeApiKey = key;
		};
		this.getVideoId = (string) => {
			var regex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/;
			var matches = string.match(regex);

			if(matches) {
				return matches[1];
			} else {
				return string;
			}
		};
		this.addToQueue = (video, message, mute = false) => {
			if(aliases.hasOwnProperty(video.toLowerCase())) {
				video = aliases[video.toLowerCase()];
			}

			var video_id = get_video_id(video);

			ytdl.getInfo("https://www.youtube.com/watch?v=" + video_id, (error, info) => {
				if(error) {
					message.reply("The requested video (" + video_id + ") does not exist or cannot be played.");
					console.log("Error (" + video_id + "): " + error);
				} else {
					queue.push({title: info["title"], id: video_id, user: message.author.username});
					if (!mute) {
						message.reply('"' + info["title"] + '" has been added to the queue.');
					}
					if(!stopped && !is_bot_playing() && queue.length === 1) {
						play_next_song();
					}
				}
			});
		};
		this.playNextSong = () => {
			if(is_queue_empty()) {
				text_channel.sendMessage("The queue is empty!");
			}

			var video_id = queue[0]["id"];
			var title = queue[0]["title"];
			var user = queue[0]["user"];

			now_playing_data["title"] = title;
			now_playing_data["user"] = user;

			if(inform_np) {
				text_channel.sendMessage('Now playing: "' + title + '" (requested by ' + user + ')');
				bot.user.setGame(title);
			}

			var audio_stream = ytdl("https://www.youtube.com/watch?v=" + video_id);
			voice_handler = voice_connection.playStream(audio_stream);

			voice_handler.once("end", reason => {
				voice_handler = null;
				bot.user.setGame();
				if(!stopped && !is_queue_empty()) {
					play_next_song();
				}
			});

			queue.splice(0,1);
		};
		this.queuePlaylist = (id, message, token = '') => {
			request("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistId + "&key=" + yt_api_key + "&pageToken=" + pageToken, (error, response, body) => {
				var json = JSON.parse(body);
				if ("error" in json) {
					message.reply("An error has occurred: " + json.error.errors[0].message + " - " + json.error.errors[0].reason);
				} else if (json.items.length === 0) {
					message.reply("No videos found within playlist.");
				} else {
					for (var i = 0; i < json.items.length; i++) {
						add_to_queue(json.items[i].snippet.resourceId.videoId, message, true)
					}
					if (json.nextPageToken == null){
						return;
					}
					queue_playlist(playlistId, message, json.nextPageToken)
				}
			});
		};
		this.searchVideo = (message, query) => {
			request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, (error, response, body) => {
				var json = JSON.parse(body);
				if("error" in json) {
					message.reply("An error has occurred: " + json.error.errors[0].message + " - " + json.error.errors[0].reason);
				} else if(json.items.length === 0) {
					message.reply("No videos found matching the search criteria.");
				} else {
					add_to_queue(json.items[0].id.videoId, message);
				}
			})
		};
	}
}

module.exports = (new MusicPlayer);