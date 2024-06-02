import { Message } from "discord.js";
import { MessageHelper } from "../messageHelper/MessageHelper";
import { CozyClient } from "../CozyClient";
import { DiscordConfigManager } from "../config/DiscordConfigManager";
import { GuildTextBasedChannel } from "discord.js";

export class CountingManager {
  private previousNumbers: Map<string, number>;
  private discordConfigManager: DiscordConfigManager;

  public constructor() {
    this.previousNumbers = new Map();

    this.discordConfigManager = new DiscordConfigManager();
  }

  public async onClientReady(client: CozyClient): Promise<void> {
    //! This method scales terribly good luck in the future :)

    try {
      const guilds = await client.guilds.fetch();

      for (const [ guildID, OAuth2Guild ] of guilds) {
        const cfg = await this.discordConfigManager.get(guildID);

        const guild = await OAuth2Guild.fetch()
        const channel = await guild.channels.fetch(cfg.countingChannelID) as GuildTextBasedChannel;
        const messages = await channel.messages.fetch({ limit: 50, cache: false });

        let lastMessage = messages.first(); //? The message sent last in the channel
        let hasLastMessage = true;

        let previousNumber = Number(lastMessage.content)
        let shouldSetPrevious: boolean;

        for(const [ messageID, message ] of messages) {
          shouldSetPrevious = true; //? Reset to true so the conditions get checked on every iteration

          const parsedContent = Number(message.content)

          if(isNaN(parsedContent) && message.deletable) {
            message.delete();

            if(messageID === lastMessage.id) {
              hasLastMessage = false;
            }

            shouldSetPrevious = false;
          }

          if((parsedContent >= previousNumber) && message.deletable) {
            message.delete();
            shouldSetPrevious = false;
          }

          if(shouldSetPrevious) {
            previousNumber = parsedContent;
          }

          if(!hasLastMessage) {
            lastMessage = message;
            hasLastMessage = true;
          }
        }

        this.previousNumbers.set(guildID, previousNumber);
      }
    } catch (err) {
      throw err;
    }
  }

  public async handleMessageCreate(message: Message) {
    const previousNumber = this.previousNumbers.get(message.guildId);

    // TODO - Implement a cached manager which updates the stored cache every 5 minutes
    const cfg = await this.discordConfigManager.get(message.guildId);

    if(message.channelId === cfg.countingChannelID) {
      const current = parseInt(message.content, 10);

      if(isNaN(current)) {
        return MessageHelper.replyEphemeral(message, {
          content: 'You can only send numbers in this channel!',
          selfClean: true
        });
      }
  
      if(current <= previousNumber + 1) {
        MessageHelper.replyEphemeral(message, {
          content: `Thats just not how you count...`, 
          selfClean: true
        });
      }

      if(previousNumber !== current) {
        this.previousNumbers.set(message.guildId, current);
      }
    }
  }
}