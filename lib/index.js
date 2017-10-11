'use strict';

const fs = require('fs');
const ytdl = require("ytdl-core");
const request = require("request");
const cfg = require('../config.js');
const pkg = require('../package.json');
const Discord = require('discord.js');
const Command = require('./commands/command');
const BotState = require('./botState');
const musicPlayer = require('./musicPlayer');
const search = require('youtube-search');
const validUrl = require('valid-url');
const bot = new Discord.Client();
musicPlayer.bot = bot;

const prefix = cfg.prefix;
const musicTextChannelId = cfg.textChannelId;
const musicVoiceChannelId = cfg.voiceChannelId;
const serverId = cfg.serverId;
const autoDeleteMessage = cfg.deleteAfterReply.enabled;
const autoDeleteMessageDelay = cfg.deleteAfterReply.time;
const youtubeApiKey = cfg.youtubeApiKey;
const defaultGameStatus = cfg.customPlayingMessage;
const requiredRoleId = cfg.requiredRoleId;
let commands = [];
const youtubeSearchOptions = {
  maxResults: 1,
  key: youtubeApiKey
};
musicPlayer.youtubeSearchOptions = youtubeSearchOptions;

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
  commands.push(require('./commands/' + file));
});

commands.push(new Command({
  name: 'help',
  description: 'Displays all available commands',
  parameters: [],
  fn: (msg, params) => {
    var response = "Available commands:";
    response += '```';
      
    for(var i = 0; i < commands.length; i++) {
      var c = commands[i];

      if(commands[i].name === 'Command' || commands[i].disabled) {
        continue;
      }

      response += "\n!" + c.name;
      
      if(c.parameters) {
        for(var j = 0; j < c.parameters.length; j++) {
          response += " <" + c.parameters[j] + ">";
        }
      }
      
      if(c.description) {
        response += ": " + c.description;
      }
    }

    response += '```';
      
    msg.reply(response);
  }
}));

bot.on('ready', () => {
  var server = bot.guilds.find("id", serverId);

  if(!server) {
    throw "Couldn't find server with Id '" + serverId + "'";
  }

  const serverName = server.name;

  var voiceChannel = server.channels.find(chn => chn.id === musicVoiceChannelId && chn.type === "voice"); //The voice channel the bot will connect to
  
  if(!voiceChannel) {
   throw "Couldn't find voice channel with id '" + musicVoiceChannelId + "' in server '" + serverName + "'";
  }
    
  if(musicVoiceChannelId) {
    BotState.textChannel = server.channels.find(chn => chn.id === musicVoiceChannelId && chn.type === "text"); //The text channel the bot will use to announce stuff
  

    if(!BotState.textChannel) {
      throw "Couldn't find text channel with id " + musicVoiceChannelId + "' in server '" + serverName + "'";
    }
  }

  if(requiredRoleId) {
    BotState.requiredRole = server.roles.find(role => role.id === requiredRoleId);

    if(!BotState.requiredRole) {
      throw "Couldn't find role '" + requiredRoleId + "' in server '" + serverName + "'";
    }
  }

  voiceChannel.join().then(connection => {
    BotState.voiceConnection = connection;
  }).catch(console.error);

  BotState.voiceChannel = voiceChannel;

  bot.user.setGame(defaultGameStatus);
  
  console.log("Connected!");
});

bot.on('message', msg => {
  if(!msg || !msg.content.startsWith(prefix))
    return;

  if(msg.author.bot) {
    return;
  }

  if(BotState.textChannel && msg.channel.name.toLowerCase() !== BotState.textChannel.name.toLowerCase()) {
    return;
  }

  if(BotState.requiredRole && !msg.member.roles.find(role => role.id === requiredRoleId)) {
    return msg.reply('You don\'t have permission to use that command.').then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
  }

  if(autoDeleteMessage) {
    setTimeout(() => msg.delete(), autoDeleteMessageDelay);
  }

  var server = bot.guilds.find("name", serverName);
  var voiceChannel = server.channels.find(chn => chn.id === musicVoiceChannelId && chn.type === "voice");

  const commandsNeedVoice = ['play', 'skip', 'resume'];

  if(commandsNeedVoice.find(m => msg.content.startsWith(prefix + m))) {
    voiceChannel.join().then(connection => {
      BotState.voiceConnection = connection;
    }).catch(console.error);
  }

  let command;

  if (msg.content.includes(' ')) {
    command = msg.content.substring(prefix.length, msg.content.indexOf(' ')).toLowerCase();
  } else {
    command = msg.content.substring(prefix.length);
  }

  if(!command) {
    return msg.reply('Expected arguments, received none.').then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
  }

  let commandObj;

  for (let cmd of commands) {
    if(cmd.name === command && !cmd.disabled) {
      commandObj = cmd;
    }
  }

  if(!commandObj || command === 'Command') {
    return msg.reply('Command not valid.').then(m => {
      if(autoDeleteMessage) {
        setTimeout(() => m.delete(), autoDeleteMessageDelay);
      }
    });
  }

  const args = msg.content.substring(prefix.length).split(' ');
  return commandObj.fn(msg, args);
});

bot
  .login(cfg.token)
  .then(() => console.log('Running!'))
  .catch(console.error);
