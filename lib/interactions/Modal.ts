import {  ModalSubmitInteraction } from "discord.js";

export abstract class Modal {
  public customID: string;

  public constructor(customID: string) {
    this.customID = customID;
  }

  public abstract handleInteractionCreate(interaction: ModalSubmitInteraction): Promise<unknown>;
}