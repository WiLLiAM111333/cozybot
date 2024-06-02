import {
  ChannelSelectMenuInteraction,
  RoleSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction
} from "discord.js"

export type AnySelectMenuInteraction = RoleSelectMenuInteraction
  | MentionableSelectMenuInteraction 
  | ChannelSelectMenuInteraction
  | StringSelectMenuInteraction
  | UserSelectMenuInteraction