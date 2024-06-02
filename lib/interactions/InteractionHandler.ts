import { Constants } from '../../util/Constants';
import { readdir, lstat } from 'fs/promises';
import { join } from 'path';
import { Command } from './Command';
import { Modal } from './Modal';
import { InteractionTypes } from './InteractionTypes';
import { SelectMenu } from './selectMenu/SelectMenu';
import {
  AnySelectMenuInteraction,
  ChatInputCommandInteraction,
  Interaction,
  InteractionType,
  ModalSubmitInteraction,
  REST,
  Routes
} from 'discord.js';

const {
  DISCORD_JS_PRODUCTION_TOKEN,
  DISCORD_JS_DEVELOPMENT_TOKEN,
  DISCORD_JS_APPLICATION_ID_PROD,
  DISCORD_JS_APPLICATION_ID_DEV,
  DISCORD_TEST_SERVER_ID,
  IS_VERBOSE
} = Constants;

export class InteractionHandler {
  private interactionsRoot: string;
  private interactions: InteractionTypes;
  
  public constructor() {
    this.interactions = { commands: {}, modals: {}, selectMenus: {} };
    this.interactionsRoot = join(__dirname, '..', '..', 'src', 'interactions');
    this.cacheAllInteractions();
  }

  public static async deleteCommands(): Promise<void> {
    try {
      if(IS_VERBOSE) { // Development mode
        await new REST()
          .setToken(DISCORD_JS_DEVELOPMENT_TOKEN)
          .put(
            Routes.applicationGuildCommands(DISCORD_JS_APPLICATION_ID_DEV, DISCORD_TEST_SERVER_ID), 
           { body: [] }
          )
      } else {
        await new REST()
          .setToken(DISCORD_JS_PRODUCTION_TOKEN)
          .put(
            Routes.applicationCommands(DISCORD_JS_APPLICATION_ID_PROD), 
            { body: [] }
          )
      }
    } catch (err) {
      throw err;
    }
  }

  private async cacheAllInteractions(path: string = this.interactionsRoot): Promise<void> {
    const files = await readdir(path);

    for(const file of files) {
      const newPath = join(path, file);
      const stat = await lstat(newPath);

      if(stat.isDirectory()) {
        this.cacheAllInteractions(newPath);
      } else {
        const interactionClass = (await import(newPath)).default;

        if(!interactionClass) {
          console.log(`Found no \`interactionClass\` at "${newPath}"`);
        } else {
          const interaction = new interactionClass();
    
          if(interaction instanceof Command) {
            //? Disabled during development to prevent spamming the API
            // this.interactions.commands[interaction.name] = interaction;
          }
    
          if(interaction instanceof Modal) {
            this.interactions.modals[interaction.customID] = interaction;
          }
    
          if(interaction instanceof SelectMenu) {
            this.interactions.selectMenus[interaction.customID] = interaction;
          }
        }
      }
    }
  }

  public async registerCommands(): Promise<void> {
    try {
      const commandObj = this.interactions.commands;
      const commands = [];

      for(const key in commandObj) {
        commands[commands.length++] = commandObj[key];
      }

      if(IS_VERBOSE) { // Development mode
        await new REST()
          .setToken(DISCORD_JS_DEVELOPMENT_TOKEN)
          .put(
            Routes.applicationGuildCommands(DISCORD_JS_APPLICATION_ID_DEV, DISCORD_TEST_SERVER_ID), {
              body: commands
            }
          );
      } else {
        await new REST()
          .setToken(DISCORD_JS_PRODUCTION_TOKEN)
          .put(
            Routes.applicationCommands(DISCORD_JS_APPLICATION_ID_PROD), {
              body: commands,
            }
          );
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteCommands(): Promise<void> {
    try {
      if(IS_VERBOSE) { // Development mode
        await new REST()
          .setToken(DISCORD_JS_DEVELOPMENT_TOKEN)
          .put(
            Routes.applicationGuildCommands(DISCORD_JS_APPLICATION_ID_DEV, DISCORD_TEST_SERVER_ID), 
           { body: [] }
          );
      } else {
        await new REST()
          .setToken(DISCORD_JS_PRODUCTION_TOKEN)
          .put(
            Routes.applicationCommands(DISCORD_JS_APPLICATION_ID_PROD), 
            { body: [] }
          );
      }
    } catch (err) {
      throw err;
    }
  }

  public handleInteractionCreate(interaction: Interaction): void {
    switch(interaction.type) {
      case InteractionType.ApplicationCommand:
        this.runCommand(interaction as ChatInputCommandInteraction);
      break;

      case InteractionType.ModalSubmit:
        this.runModal(interaction);
      break;

      case InteractionType.MessageComponent:
        if(interaction.isAnySelectMenu()) {
          this.runSelectMenu(interaction);
        }
      break;
    }
  }

  public runCommand(interaction: ChatInputCommandInteraction): void {
    this.interactions.commands[interaction.commandName].run(interaction);
  }
  
  public runModal(interaction: ModalSubmitInteraction): void {
    this.interactions.modals[interaction.customId].handleInteractionCreate(interaction);  
  }

  public runSelectMenu(interaction: AnySelectMenuInteraction): void {
    this.interactions.selectMenus[interaction.customId].handleInteractionCreate(interaction);
  }
}