import { Client, REST, Routes } from "discord.js";
import { configuration } from "./config";
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(configuration.DISCORD_BOT_TOKEN || '');

export async function deployCommands(bot?: Client) {
  try {
    console.log("Started refreshing application (/) commands.");
    if (!configuration.DISCORD_BOT_TOKEN) {
      throw new Error("DISCORD_BOT_TOKEN is not defined in configuration.");
    }
    const applicationId = bot?.user?.id || configuration.DISCORD_CLIENT_ID;
    if (!applicationId) {
      throw new Error("Unable to determine Discord application ID for slash commands.");
    }
    await rest.put(Routes.applicationCommands(applicationId), {
        body: commandsData,
      });
    console.log(`Successfully added slash commands: ${commandsData.map(cmd => cmd.name).join(', ')}`);
  } catch (error) {
    console.error(error);
  }
}
