'use strict';

const fs = require('fs');
const ytdl = require("ytdl-core");
const request = require("request");
const cfg = require('../config.js');
const pkg = require('../package.json');
const Discord = require('discord.js');
const botState = require('./botState');
const bot = new Discord.Client();

const prefix = cfg.prefix;
let commands = [];

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
  commands.push(require('./commands/' + file));
});

bot.on('message', msg => {
  if(!msg.content.startsWith(prefix))
    return;

  const command = msg.content.substring(prefix.length, msg.content.indexOf(' ')).toLowerCase();

  if(command === '') {
    return msg.reply('Expected arguments, received none.');
  }

  if(commands[command]) {
    const args = msg.content.substring(prefix.length).split(' ');
    return commands[command].fn(msg, args);
  }

  msg.reply('Command not valid.');
});

bot
  .login(cfg.token)
  .then(() => console.log('Running!'))
  .catch(console.error);
