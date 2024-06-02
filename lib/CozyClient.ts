import { Client, ClientOptions } from 'discord.js';
import { loadEvents } from './event/loadEvents';
import { DiscordLogger } from './logger/DiscordLogger';
import { InteractionHandler } from './interactions/InteractionHandler';
import { CountingManager } from './counting/CountingManager';
import { OneWordManager } from './oneword/OneWordManager';

export class CozyClient<Ready extends boolean = boolean> extends Client<Ready> {
  public interactionHandler: InteractionHandler;
  public logger: DiscordLogger;
  public countingManager: CountingManager;
  public oneWordManager: OneWordManager;
  
  public constructor(options: ClientOptions) {
    super(options);

    this.interactionHandler = new InteractionHandler();
    this.logger = new DiscordLogger();

    this.countingManager = new CountingManager();
    this.oneWordManager = new OneWordManager();
  }

  public async start(token?: string): Promise<void> {
    try {
      await this.login(token);
      await loadEvents(this);

      // Disabled for production testing to avoid spamming the API
      // await registerCommands();
    } catch (err) {
      throw err;
    }
  }
}