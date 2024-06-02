import { ModalSubmitInteraction } from "discord.js";
import { Modal } from "../../../lib/interactions/Modal";
import { Constants } from "../../../util/Constants";

const { InteractionCustomIDs } = Constants;

export default class extends Modal {
  public constructor() {
    super(InteractionCustomIDs.MOD_APPLICATION_MODAL);
  }

  public async handleInteractionCreate(interaction: ModalSubmitInteraction): Promise<void> {
    try {
      await interaction.reply({ content: 'Thank you for the application or something like that ', ephemeral: true });
    } catch (err) {
      throw err;
    }
  }
}