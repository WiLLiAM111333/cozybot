import { Message } from "discord.js";
import { MessageHelper } from "../messageHelper/MessageHelper";

export class OneWordManager {
  public constructor() {}

  public async handleMessageCreate(message: Message): Promise<unknown> {
    try {
      if(message.channel.id === '1246567502650019932') { //? Temporary for development (`#test-oneword` in the server)
        if(/\s+/.test(message.content)) {
          return MessageHelper.replyEphemeral(message, {
            content: 'You can only send one word at a time in this channel!',
            selfClean: true
          });
        }
  
        if(MessageHelper.hasAttachments(message)) {
          return MessageHelper.replyEphemeral(message, {
            content: 'You cannot send attachments in this channel!',
            selfClean: true
          });
        }
  
        if(MessageHelper.hasLink(message)) {
          return MessageHelper.replyEphemeral(message, {
            content: 'You cannot send links in this channel!',
            selfClean: true
           });
        }
  
        if(MessageHelper.hasEmote(message)) {
          return MessageHelper.replyEphemeral(message, {
            content: 'You cannot send emotes in this channel!',
            selfClean: true
          });
        }
  
        if(MessageHelper.hasSticker(message)) {
          return MessageHelper.replyEphemeral(message, {
            content: 'You cannot send stickers in this channel!',
            selfClean: true
          });
        }
      }
    } catch (err) {
      throw err;
    }
  }
}