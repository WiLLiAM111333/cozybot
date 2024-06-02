import { Command } from "./Command";
import { Modal } from "./Modal";
import { AnySelectMenuInteraction } from "./selectMenu/AnySelectMenuBuilder";
import { SelectMenu } from "./selectMenu/SelectMenu";

// TODO: Map this type over a set of predefined keys and types as a type
export interface InteractionTypes {
  commands: { [key: string]: Command };
  modals: { [key: string]: Modal };
  selectMenus: { [key: string]: SelectMenu<AnySelectMenuInteraction> };
}