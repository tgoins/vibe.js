const BotState = require('./botState')
const ytdl = require('ytdl-core')
const request = require('request')
const cfg = require('../config.js')
const autoDeleteMessage = cfg.deleteAfterReply.enabled
const autoDeleteMessageDelay = cfg.deleteAfterReply.time

class MusicPlayer {
  constructor () {
    this.bot = null
    this.getVideoId = string => {
      const regex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/
      const matches = string.match(regex)

      if (matches) {
        return matches[1]
      }
      return string
    }
    this.playNextSong = () => {
      if (BotState.isQueueEmpty()) {
        return BotState.textChannel.sendMessage('The queue is empty!').then(m => {
          if (autoDeleteMessage) {
            setTimeout(() => m.delete(), autoDeleteMessageDelay)
          }
        })
      }

      BotState.stopped = false
      if (!BotState.voiceConnection) {
        BotState.voiceChannel
          .join()
          .then(connection => {
            BotState.voiceConnection = connection
          })
          .catch(console.error)
      }

      const videoId = BotState.queue[0].id
      const title = BotState.queue[0].title
      const user = BotState.queue[0].user

      BotState.nowPlaying = BotState.queue[0]

      let embed = {
        title: ' ',
        color: 0x2196f3,
        author: {
          name: 'Now playing: ' + title,
          icon_url: 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg'
        },
        thumbnail: {
          url: 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg'
        },
        fields: [
          {
            name: 'Link',
            value: '[Click Here](' + 'https://www.youtube.com/watch?v=' + videoId + ')',
            inline: true
          },
          {
            name: 'Requested By',
            value: user,
            inline: true
          }
        ],
        footer: {
          text: 'Vibe.js | The joy of music.'
        }
      }

      if(BotState.queue.length > 1) {
        embed.fields.push({
          name: 'Up Next',
          value: BotState.queue[1].title
        })
      }

      BotState.textChannel.send({ embed }).then(m => {
        if (autoDeleteMessage) {
          setTimeout(() => m.delete(), autoDeleteMessageDelay)
        }
      })

      this.bot.user.setGame(title)

      const audioStream = ytdl('https://www.youtube.com/watch?v=' + videoId)
      BotState.voiceHandler = BotState.voiceConnection.playStream(audioStream)
      BotState.queue.shift()

      BotState.voiceHandler.once('end', () => {
        setTimeout(() => {
          BotState.voiceHandler = null
          this.bot.user.setGame(cfg.customPlayingMessage)
          if (!BotState.isPlaying() && !BotState.stopped && BotState.queue.length > 0) {
            this.playNextSong()
          } else if (!BotState.isPlaying() && BotState.isQueueEmpty()) {
            BotState.voiceChannel.leave()
          }
        }, 3000)
      })
    }
    this.addToQueue = (video, message, mute = false) => {
      const videoId = this.getVideoId(video)

      ytdl.getInfo('https://www.youtube.com/watch?v=' + videoId, (error, info) => {
        if (error) {
          message
            .reply(
              'The requested video (' + videoId + ') does not exist or cannot be played.'
            )
            .then(m => {
              if (autoDeleteMessage) {
                setTimeout(() => m.delete(), autoDeleteMessageDelay)
              }
            })
          console.log('Error (' + videoId + '): ' + error)
        } else {
          BotState.queue.push({
            title: info.title,
            id: videoId,
            user: message.author.username
          })
          if (!mute) {
            message.reply('"' + info.title + '" has been added to the queue.').then(m => {
              if (autoDeleteMessage) {
                setTimeout(() => m.delete(), autoDeleteMessageDelay)
              }
            })
          }
          if (!BotState.stopped && !BotState.isPlaying() && BotState.queue.length > 0) {
            this.playNextSong()
          } else if(!BotState.stopped && BotState.isPlaying() && BotState.queue.length === 1) {
            let embed = {
              title: ' ',
              color: 0x2196f3,
              author: {
                name: 'Up next: ' + BotState.queue[0].title,
                icon_url: 'https://img.youtube.com/vi/' + BotState.queue[0].id + '/hqdefault.jpg'
              },
              thumbnail: {
                url: 'https://img.youtube.com/vi/' + BotState.queue[0].id + '/hqdefault.jpg'
              },
              fields: [
                {
                  name: 'Link',
                  value: '[Click Here](' + 'https://www.youtube.com/watch?v=' + BotState.queue[0].id + ')',
                  inline: true
                },
                {
                  name: 'Requested By',
                  value: BotState.queue[0].user,
                  inline: true
                }
              ],
              footer: {
                text: 'Vibe.js | The joy of music.'
              }
            }

            message.reply({embed}).then(m => {
              if (autoDeleteMessage) {
                setTimeout(() => m.delete(), autoDeleteMessageDelay)
              }
            })
          }
        }
      })
    }

    this.queuePlaylist = (id, message, token = '') => {
      request(
        'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' +
          id +
          '&key=' +
          cfg.youtubeApiKey +
          '&pageToken=' +
          token,
        (error, response, body) => {
          if (error) {
            throw error
          }

          const json = JSON.parse(body)
          if ('error' in json) {
            message
              .reply(
                'An error has occurred: ' +
                  json.error.errors[0].message +
                  ' - ' +
                  json.error.errors[0].reason
              )
              .then(m => {
                if (autoDeleteMessage) {
                  setTimeout(() => m.delete(), autoDeleteMessageDelay)
                }
              })
          } else if (json.items.length === 0) {
            message.reply('No videos found within playlist.').then(m => {
              if (autoDeleteMessage) {
                setTimeout(() => m.delete(), autoDeleteMessageDelay)
              }
            })
          } else {
            for (let i = 0; i < json.items.length; i++) {
              this.addToQueue(json.items[i].snippet.resourceId.videoId, message, true)
            }
            if (json.nextPageToken === null) {
              return
            }
            this.queuePlaylist(id, message, json.nextPageToken)
          }
        }
      )
    }
    this.youtubeSearchOptions = null
  }
}

module.exports = new MusicPlayer()
