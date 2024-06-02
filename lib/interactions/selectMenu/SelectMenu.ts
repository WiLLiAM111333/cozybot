import { AnySelectMenuInteraction } from './AnySelectMenuBuilder';

export abstract class SelectMenu<T extends AnySelectMenuInteraction> {
  public customID: string;

  public constructor(customID: string) {
    this.customID = customID;
  }

  public abstract handleInteractionCreate(interaction: T): Promise<unknown>;
}