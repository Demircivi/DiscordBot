import MessageHandler from "../interfaces/message-handler";
import * as Discord from "discord.js";
import ArrayHelper from "../../../helpers/array-helper";

export default class HelloMessageHandler implements MessageHandler {
    private static readonly HELLO_MESSAGES: string[] = ["hello", "hi", "hi there", "sup?", "aha"]

    aliases: string[] = ["hi", "hello"];
    description: string = "Bot says hello";

    async execute(message: Discord.Message, args: string[]) {
        let helloMessage = ArrayHelper.getRandomItem(HelloMessageHandler.HELLO_MESSAGES);

        if (!helloMessage) {
            helloMessage = "Found no way to greet you";

            console.error("Failed to find hello message");
        }

        await message.reply(helloMessage);
    }
}
