import { CommandInteraction } from "discord.js";
import { Command } from "../../lib/interactions/Command";

export default class extends Command {
  public constructor() {
    super();

    this
      .setName('dev')
      .setDescription('test')
  }

  public async run(interaction: CommandInteraction): Promise<unknown> {
    if(interaction.member.user.id !== process.env.WILLIAM_ID) {
      return interaction.reply({ content: 'poop', ephemeral: true });
    }

    interaction.reply({ content: 'Currently in development', ephemeral: true });
  }
}