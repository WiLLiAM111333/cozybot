import { Interaction } from "discord.js";
import { CozyClient } from "../../lib/CozyClient";
import { Event } from "../../lib/event/Event";

export default class extends Event<'interactionCreate'> {
  public constructor() {  
    super('interactionCreate');
  }

  public override async callback(client: CozyClient, interaction: Interaction): Promise<void> {
    client.interactionHandler.handleInteractionCreate(interaction);
  }
}