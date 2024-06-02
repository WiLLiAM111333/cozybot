import { Schema, model } from 'mongoose';

export const DiscordConfig = model('discord_config', new Schema({
  guildID: {
    type: String,
    required: true
  },
  countingChannelID: {
    type: String,
    required: true
  },
  oneWordChannelID: {
    type: String,
    required: true
  }
}));
