import { Message, Awaitable } from "discord.js";
import { CozyClient } from "../../lib/CozyClient";
import { Event } from "../../lib/event/Event";

export default class extends Event<'messageCreate'> {
  public constructor() {
    super('messageCreate');
  }

  public override callback(client: CozyClient, message: Message): Awaitable<void> {
    if(message.author.bot) return;

    client.oneWordManager.handleMessageCreate(message);
    client.countingManager.handleMessageCreate(message);

    if(message.author.id === "107424723050180608" && message.content === 'devtest') {
      message.reply({ content: 'test' });
    }
  }
}
