'use strict';

const fs = require('fs');
const ytdl = require("ytdl-core");
const request = require("request");
const cfg = require('../config.js');
const pkg = require('../package.json');
const Discord = require('discord.js');
const Command = require('./commands/command');
const botState = require('./botState');
const musicPlayer = require('./musicPlayer');
const bot = new Discord.Client();
musicPlayer.bot = bot;

const prefix = cfg.prefix;
const musicTextChannel = cfg.textChannel;
const musicVoiceChannel = cfg.voiceChannel;
const serverName = cfg.serverName;
let commands = [];

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
  commands.push(require('./commands/' + file));
});

commands.push(new Command({
  name: 'help',
  description: 'Displays all available',
  parameters: [],
  fn: (msg, params) => {
    var response = "Available commands:";
      
      for(var i = 0; i < commands.length; i++) {
        var c = commands[i];
        response += "\n!" + c.command;
        
        if(c.parameters) {
          for(var j = 0; j < c.parameters.length; j++) {
            response += " <" + c.parameters[j] + ">";
          }
        }
        
        if(c.description) {
          response += ": " + c.description;
        }
      }
      
      msg.reply(response);
  }
}));

bot.on('ready', () => {
  var server = bot.guilds.find("name", serverName);

  if(!server) {
    throw "Couldn't find server '" + serverName + "'";
  }

  var voiceChannel = server.channels.find(chn => chn.name === musicVoiceChannel && chn.type === "voice"); //The voice channel the bot will connect to
  
  if(!voiceChannel) {
   throw "Couldn't find voice channel '" + musicVoiceChannel + "' in server '" + serverName + "'";
  }
    
  botState.textChannel = server.channels.find(chn => chn.name === musicTextChannel && chn.type === "text"); //The text channel the bot will use to announce stuff

  if(!botState.textChannel) {
    throw "Couldn't find text channel '#" + musicTextChannel + "' in server '" + serverName + "'";
  }

  voiceChannel.join().then(connection => {
    botState.voiceConnection = connection;
    console.log(connection);
  }).catch(console.error);
});

bot.on('message', msg => {
  if(!msg || !msg.content.startsWith(prefix))
    return;

  let command;

  if (msg.content.includes(' ')) {
    command = msg.content.substring(prefix.length, msg.content.indexOf(' ')).toLowerCase();
  } else {
    command = msg.content.substring(prefix.length);
  }

  if(!command) {
    return msg.reply('Expected arguments, received none.');
  }

  let commandObj;

  for (let cmd of commands) {
    if(cmd.name === command) {
      commandObj = cmd;
    }
  }

  if(!commandObj) {
    return msg.reply('Command not valid.');
  }

  const args = msg.content.substring(prefix.length).split(' ');
  return commandObj.fn(msg, args);
});

bot
  .login(cfg.token)
  .then(() => console.log('Running!'))
  .catch(console.error);
