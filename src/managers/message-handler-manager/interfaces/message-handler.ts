import * as Discord from "discord.js";

export default interface MessageHandler {
    aliases: string[];
    description: string;

    execute(message: Discord.Message, args: string[]): Promise<void>;
}
