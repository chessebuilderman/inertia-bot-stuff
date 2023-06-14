//------------------------------------------------------------//
//    Copyright (c) Inertia Lighting, Some Rights Reserved    //
//------------------------------------------------------------//

import * as Discord from 'discord.js';

import { automatedQuickSupportHandler } from '../handlers/automated_quick_support_handler';

import { suggestionsCategoryHandler } from '../handlers/suggestions_category_handler';

//------------------------------------------------------------//

const bot_guild_id = `${process.env.BOT_GUILD_ID ?? ''}`;
if (bot_guild_id.length < 1) throw new Error('environment variable: BOT_GUILD_ID; was not properly set or is empty');

const suggestions_category_id = `${process.env.BOT_SUGGESTIONS_CATEGORY_ID ?? ''}`;
if (suggestions_category_id.length < 1) throw new Error('environment variable: BOT_SUGGESTIONS_CATEGORY_ID; was not properly set or is empty');

//------------------------------------------------------------//

export default {
    name: Discord.Events.MessageCreate,
    async handler(
        message: Discord.Message,
    ) {
        /* don't allow bots */
        if (message.author.bot) return;

        /* don't allow system accounts */
        if (message.author.system) return;

        /* only allow messages from inside of a guild */
        if (!message.inGuild()) return;

        /* only allow messages from inside of the bot guild */
        if (message.guild.id !== bot_guild_id) return;

        /* only allow text channels */
        if (!message.channel.isTextBased()) return;

        /* handle messages sent in suggestions channels */
        if (message.channel.parent?.id === suggestions_category_id) {
            suggestionsCategoryHandler(message);
            return;
        }

        /* respond to mentions of this bot */
        if (message.content.startsWith(`<@!${message.client.user.id}>`)) {
            message.reply({
                content: [
                    'To see a list of commands do \`/help\`!',
                ].join('\n'),
            }).catch(console.warn);
            return;
        }

        /* attempt automated quick support */
        automatedQuickSupportHandler(message).catch(console.trace);
    },
};
