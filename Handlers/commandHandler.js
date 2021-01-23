'use strict';

const Discord = require('discord.js');

async function commandHandler(client, message, prefix, errorEmbed, mongo, userSchema) {
    /* find command by command_name */
    const args = message.content.slice(prefix.length).trim().split(/\s+/g);
    const command_name = args.shift().toLowerCase();
    const command = client.$.commands.get(command_name) ?? client.$.commands.find(cmd => cmd.aliases?.includes(command_name));
    if (!command) {
        message.reply(new Discord.MessageEmbed({
            color: 0xFF0000,
            author: {
                name: `${client.user.name}`,
                iconURL: `${client.user.avatarURL()}`,
                url: 'https://inertia-lighting.xyz',
            },
            title: 'Command Error',
            description: 'That is not a vailid command!',
        }));
        return;
    }

    /* command permissions */
    if (command.staffOnly && !message.member.roles.cache.has('789342326978772992')) {
        errorEmbed(message);
        return;
    }
    if (command.ownerOnly && message.author.id !== `196254672418373632` && message.author.id !== '331938622733549590') {
        errorEmbed(message);
        return;
    }

    /* command execution */
    try {
        await command.execute(message, args, client, Discord, prefix, mongo, userSchema);
    } catch (error) {
        console.trace(error);

        message.reply(new Discord.MessageEmbed({
            color: 0xFF0000,
            author: {
                name: `${client.user.name}`,
                iconURL: `${client.user.avatarURL()}`,
                url: 'https://inertia-lighting.xyz',
            },
            title: 'Command Error',
            description: `Looks like I ran into an error while trying to run ${command_name}`,
        }));
    }
}

module.exports = {
    commandHandler,
}