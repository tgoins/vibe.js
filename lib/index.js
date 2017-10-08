'use strict';

const fs = require('fs');
const cfg = require('../config.js');
const pkg = require('../package.json');
const Discord = require('discord.js');
const bot = new Discord.Client();

const prefix = cfg.prefix;

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
  //app.addCommand(require('./commands/' + file));
});

bot.on('message', msg => {
  // Fired when someone sends a message
});

bot
  .login(cfg.token)
  .then(() => console.log('Running!'))
  .catch(console.error);
