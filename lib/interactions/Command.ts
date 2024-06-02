import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, InteractionReplyOptions, InteractionResponse } from "discord.js";

export abstract class Command extends SlashCommandBuilder {
  public constructor() {
    super();
  }

  public abstract run(interaction: ChatInputCommandInteraction): Promise<unknown>

  protected replyEphemeral(interaction: ChatInputCommandInteraction, options: InteractionReplyOptions): Promise<InteractionResponse<boolean>> {
    options.ephemeral = true;
    return interaction.reply(options);
  }
}
