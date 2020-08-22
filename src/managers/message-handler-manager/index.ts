import * as fs from "fs";
import MessageHandler from "./interfaces/message-handler";
import * as Discord from "discord.js";
import ConfigManager from "../../config/config-manager";
import MiscHelper from "../../helpers/misc-helper";

export default class MessageHandlerManager {
    private static readonly HANDLERS_FOLDER_NAME = "handlers";
    private static readonly HELP_COMMAND = "help";

    private messageHandlers: MessageHandler[];

    public constructor(
        private client: Discord.Client
    ) {
        this.registerMessageHandlers();
    }

    private registerMessageHandlers() {
        this.messageHandlers = fs
            .readdirSync(`${__dirname}/${MessageHandlerManager.HANDLERS_FOLDER_NAME}`)
            .filter(filename => filename.endsWith(".ts"))
            .map(filename => `${__dirname}/${MessageHandlerManager.HANDLERS_FOLDER_NAME}/${filename}`)
            .map(filename => new (require(filename)).default());

        if (this.messageHandlers.some(i => i.aliases.length === 0)) {
            throw new Error(`There is a message handler with no aliases in it`);
        }

        this.messageHandlers.forEach(messageHandler =>
            console.info("Loaded '" + messageHandler.aliases.join(", ") + "' argument(s) listener"));

        this.client.on("message", async (message: Discord.Message) => this.messageArrived(message));
    }

    private async messageArrived(message: Discord.Message) {
        if (message.author.bot) {
            return;
        }

        if (message.type !== "DEFAULT") {
            return;
        }

        const args = message.content.split(" ");

        if (args.length === 0) {
            console.log("args.length was 0, not processing the message");

            return;
        }

        let command = args[0];

        if (!command.startsWith(ConfigManager.config.commandPrefix)) {
            return;
        }

        command = command.substring(ConfigManager.config.commandPrefix.length);

        args.shift();

        console.log(`> ${message.author.username}: ${message.content}`);

        await this.executeCommand(message, command, args);
    }

    private async executeCommand(message: Discord.Message, command: string, args: string[]) {
        if (command === MessageHandlerManager.HELP_COMMAND) {
            await this.helpMessageArrived(message);

            return;
        }

        const messageHandler = this.messageHandlers.find(i => i.aliases.indexOf(command) !== -1);

        if (!messageHandler) {
            await MessageHandlerManager.unknownMessageArrived(message);

            return;
        }

        try {
            await messageHandler.execute(message, args);
        } catch (error) {
            console.log(error);

            await MiscHelper.sendAndDelete(
                message, {
                    content: "Failed to process your request, contact to the developers if this problem persists"
                }
            );
        }
    }

    private async helpMessageArrived(message: Discord.Message) {
        const reply = new Discord.MessageEmbed();

        reply.setTitle("Available commands");

        for (let messageHandler of this.messageHandlers) {
            const aliasesJoined = messageHandler.aliases.map(i => `${ConfigManager.config.commandPrefix}${i}`).join(", ");

            reply.addField("**" + aliasesJoined + "**", messageHandler.description);
        }

        await message.reply(reply);
    }

    private static async unknownMessageArrived(message: Discord.Message) {
        if (!ConfigManager.config.enableUnknownCommandMessage) {
            return;
        }

        await message.reply(
            `Unknown command.\nType \`${ConfigManager.config.commandPrefix}help\` to get the list of commands`
        );
    }
}
