'use strict'

const fs = require('fs')
const cfg = require('../config.js')
const Discord = require('discord.js')
const Command = require('./commands/command')
const BotState = require('./botState')
const musicPlayer = require('./musicPlayer')
const bot = new Discord.Client()
musicPlayer.bot = bot

const prefix = cfg.prefix
const musicTextChannelId = cfg.textChannelId
const musicVoiceChannelId = cfg.voiceChannelId
const serverId = cfg.serverId
const autoDeleteMessage = cfg.deleteAfterReply.enabled
const autoDeleteMessageDelay = cfg.deleteAfterReply.time
const youtubeApiKey = cfg.youtubeApiKey
const defaultGameStatus = cfg.customPlayingMessage
const requiredRoleId = cfg.requiredRoleId
let commands = []
const youtubeSearchOptions = {
  maxResults: 1,
  key: youtubeApiKey
}
musicPlayer.youtubeSearchOptions = youtubeSearchOptions

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
  commands.push(require('./commands/' + file))
})

commands.push(
  new Command({
    name: 'help',
    description: 'Displays all available commands',
    parameters: [],
    fn: (msg) => {
      let response = 'Available commands:'
      response += '```'

      for (let i = 0; i < commands.length; i++) {
        let command = commands[i]

        if (commands[i].name === 'Command' || commands[i].disabled) {
          continue
        }

        response += '\n!' + command.name

        if (command.parameters) {
          for (let j = 0; j < command.parameters.length; j++) {
            response += ' <' + command.parameters[j] + '>'
          }
        }

        if (command.description) {
          response += ': ' + command.description
        }
      }

      response += '```'

      msg.reply(response)
    }
  })
)

bot.on('ready', () => {
  const server = bot.guilds.find('id', serverId)

  if (!server) {
    throw new Error("Couldn't find server with Id '" + serverId + "'")
  }

  const serverName = server.name

  const voiceChannel = server.channels.find(
    chn => chn.id.toString() === musicVoiceChannelId.toString() && chn.type === 'voice'
  ) // The voice channel the bot will connect to

  if (!voiceChannel) {
    throw new Error("Couldn't find voice channel with id '" +
      musicVoiceChannelId +
      "' in server '" +
      serverName +
      "'")
  }

  if (musicTextChannelId) {
    BotState.textChannel = server.channels.find(
      chn => chn.id.toString() === musicTextChannelId.toString() && chn.type === 'text'
    ) // The text channel the bot will use to announce stuff

    if (!BotState.textChannel) {
      throw new Error("Couldn't find text channel with id " +
        musicTextChannelId +
        "' in server '" +
        serverName +
        "'")
    }
  }

  if (requiredRoleId) {
    BotState.requiredRole = server.roles.find(role => role.id.toString() === requiredRoleId.toString())

    if (!BotState.requiredRole) {
      throw new Error("Couldn't find role '" + requiredRoleId + "' in server '" + serverName + "'")
    }
  }

  voiceChannel
    .join()
    .then(connection => {
      BotState.voiceConnection = connection
    })
    .catch(console.error)

  BotState.voiceChannel = voiceChannel

  bot.user.setGame(defaultGameStatus)

  console.log('Connected!')
})

bot.on('message', msg => {
  if (!msg || !msg.content.startsWith(prefix)) return

  if (msg.author.bot) {
    return
  }

  if (
    BotState.textChannel &&
    msg.channel.name.toLowerCase() !== BotState.textChannel.name.toLowerCase()
  ) {
    return
  }

  if (!BotState.textChannel) {
    BotState.textChannel = msg.channel
  }

  if (
    BotState.requiredRole &&
    !msg.member.roles.find(role => role.id.toString() === requiredRoleId.toString())
  ) {
    return msg.reply("You don't have permission to use that command.").then(m => {
      if (autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay)
      }
    })
  }

  if (autoDeleteMessage) {
    setTimeout(() => msg.delete(), autoDeleteMessageDelay)
  }

  const server = bot.guilds.find('id', serverId)

  const voiceChannel = server.channels.find(
    chn => chn.id.toString() === musicVoiceChannelId.toString() && chn.type === 'voice'
  )

  const commandsNeedVoice = ['play', 'skip', 'resume', 'add']

  if (commandsNeedVoice.find(m => msg.content.startsWith(prefix + m))) {
    voiceChannel
      .join()
      .then(connection => {
        BotState.voiceConnection = connection
      })
      .catch(console.error)
  }

  let command

  if (msg.content.includes(' ')) {
    command = msg.content
      .substring(prefix.length, msg.content.indexOf(' '))
      .toLowerCase()
  } else {
    command = msg.content.substring(prefix.length)
  }

  if (!command) {
    return msg.reply('Expected arguments, received none.').then(m => {
      if (autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay)
      }
    })
  }

  let commandObj

  for (let cmd of commands) {
    if (cmd.name === 'Command') {
      continue
    }

    if ((cmd.name === command || cmd.aliases.find(a => a === command)) && !cmd.disabled) {
      commandObj = cmd
    }
  }

  if (!commandObj || command === 'Command') {
    return msg.reply('Command not valid.').then(m => {
      if (autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay)
      }
    })
  }

  const args = msg.content.substring(prefix.length).split(' ')
  return commandObj.fn(msg, args)
})

bot
  .login(cfg.token)
  .then(() => console.log('Running!'))
  .catch(console.error)
