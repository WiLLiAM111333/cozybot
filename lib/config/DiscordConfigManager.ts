import { DiscordConfig } from '../../db/models/DiscordConfig';
import { IDiscordConfig } from "./IDiscordConfig";
import { Snowflake } from "discord.js";

export class DiscordConfigManager {
  public async create({ guildID, countingChannelID, oneWordChannelID }: Partial<IDiscordConfig>): Promise<void> {
    try {
      const cfg = new DiscordConfig({ guildID, countingChannelID, oneWordChannelID });

      await cfg.save();
    } catch (err: unknown) {
      this.handleError(err);
    }
  }

  public async update(data: Partial<IDiscordConfig>): Promise<void> {
    try {
      const { guildID } = data;

      const old = await DiscordConfig.findOne({ guildID });
      const obj = { guildID }

      for(const key in old) {
        const oldValue = old[key];
        const newValue = data[key];

        if(newValue && newValue !== oldValue) {
          //! Do not re-assign oldValue as it does not change the object.
          obj[key] = newValue;
        }
      }

      await DiscordConfig.updateOne(obj);
    } catch (err: unknown) {
      this.handleError(err);
    }
  }

  public async has(guildID: Snowflake): Promise<boolean> {
    try {
      return !!(await DiscordConfig.findOne({ guildID }))
    } catch (err: unknown) {
      this.handleError(err);
    }
  }

  public async get(guildID: Snowflake): Promise<IDiscordConfig> {
    try {
      return await DiscordConfig.findOne({ guildID });
    } catch (err: unknown) {
      this.handleError(err);
    }
  }

  public handleError(err: Error | unknown): never { // TODO: HANDLE ERROR
    throw err;
  }
}
