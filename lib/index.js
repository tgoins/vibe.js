'use strict';

const fs = require('fs');
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

  const command = msg.content.substring(prefix.length, msg.content.indexOf(' '));

  if(commands[command]) {
    const args = msg.content.substring(msg.content.indexOf(' ') + 1).split(' ');
    commands[command].fn(args);
  }

});

bot
  .login(cfg.token)
  .then(() => console.log('Running!'))
  .catch(console.error);
