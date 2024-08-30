const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        console.log('succ');
      
        if (message.mentions.has(message.client.user)) {
            message.channel.send(`Use /commands to get started!`);
        }
    },
};