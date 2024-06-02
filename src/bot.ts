import { CozyClient } from '../lib/CozyClient';
import { Constants } from '../util/Constants';
import { Util } from '../util/Util';

const { DISCORD_JS_DEVELOPMENT_TOKEN, DISCORD_JS_PRODUCTION_TOKEN } = Constants;

const client = new CozyClient({
  intents: [
    'Guilds',
    'GuildMembers',
    'GuildBans',
    'GuildEmojisAndStickers',
    'GuildIntegrations',
    'GuildWebhooks',
    'GuildInvites',
    'GuildMessages',
    'GuildIntegrations',
    'MessageContent'
  ]
});

if(Util.isProduction()) {
  client.start(DISCORD_JS_PRODUCTION_TOKEN);
} else {
  client.start(DISCORD_JS_DEVELOPMENT_TOKEN);
  // console.log('logged in')
}