import { APIEmbed, JSONEncodable, Message } from "discord.js";
import { Constants } from "../../util/Constants";

const { DISCORD_REGEX, URL_REGEX } = Constants;


export class MessageHelper {
  public constructor() {
    throw new ReferenceError('Can not instantiate static class MessageHelper')
  }

  public static deleteAfter(message: Message, ms: number = 1000) {
    if(message.deletable) {
      setTimeout(() => message.delete(), ms).unref();
    }
  }

  public static hasAttachments(message: Message): boolean {
    return !!message.attachments.size
  }

  public static hasLink(message: Message): boolean {
    return URL_REGEX.test(message.content);
  }

  public static hasEmote(message: Message): boolean {
    return DISCORD_REGEX.emote_global.test(message.content);
  }

  public static hasSticker(message: Message): boolean {
    return !!message.stickers.size
  }

  public static replyEphemeral(message: Message, { content, embeds, selfClean }: { content?: string, embeds?: Array<APIEmbed | JSONEncodable<APIEmbed>>, selfClean?: boolean }): void {
    message.reply({ content, embeds, options: { ephemeral: true } }).then(msg => {
      if(selfClean) {
        this.deleteAfter(msg, 2000)
      }
    });
  }

  public static async fetchPreviousFromChannel(message: Message): Promise<[Message, Message]> {
    const messages = await message.channel.messages.fetch({ limit: 2 });

    return messages.toJSON() as [Message, Message];
  }
}