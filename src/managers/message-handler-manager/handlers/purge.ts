import MessageHandler from "../interfaces/message-handler";
import * as Discord from "discord.js";
import {DMChannel, NewsChannel, TextChannel} from "discord.js";
import StringHelper from "../../../helpers/string-helper";
import AuthorizationHelper from "../../../helpers/authorization-helper";
import MiscHelper from "../../../helpers/misc-helper";
import ConfigManager from "../../../config/config-manager";

export default class PurgeMessageHandler implements MessageHandler {
    private static readonly MAX_COUNT_OF_MESSAGES_TO_DELETE_IN_ONE_TURN = 100;

    aliases: string[] = ["purge", "delete", "clear"];
    description: string = "Deletes specified amount of messages from the channel";

    async execute(message: Discord.Message, args: string[]) {
        if (!AuthorizationHelper.hasPermission(message.member, "MANAGE_MESSAGES")) {
            await message.reply("You don't have the permission to manage the messages");

            return;
        }

        if (args.length !== 1) {
            await message.reply("Please specify the amount of messages to delete");

            return;
        }

        if (!StringHelper.isStringBuildWithNumbersOnly(args[0])) {
            await message.reply("Please give a valid number");

            return;
        }

        const messageCountToDelete = Number(args[0]) + 1;

        if (messageCountToDelete >= ConfigManager.config.maximumMessageCountToPurge) {
            await MiscHelper.sendAndDelete(message, {
                content: `Can't delete that amount of messages, maximum is: ` +
                    `${ConfigManager.config.maximumMessageCountToPurge}.`,
                secondsToWait: 3
            });

            return;
        }

        await MiscHelper.animateSeconds(message, 3);

        try {
            await this.deleteMessages(messageCountToDelete, message.channel);
        } catch {
            await MiscHelper.sendAndDelete(
                message, {
                    content: "Failed to delete messages, " +
                        "maybe the messages that you're trying to delete are older than 14 days?"
                }
            );

            return;
        }

        await MiscHelper.sendAndDelete(message, {
            content: `Deleted ${messageCountToDelete} messages`,
            secondsToWait: 3
        });
    }

    private async deleteMessages(messageCountToDelete: number, channel: TextChannel | DMChannel | NewsChannel) {
        while (messageCountToDelete > 0) {
            if (messageCountToDelete < PurgeMessageHandler.MAX_COUNT_OF_MESSAGES_TO_DELETE_IN_ONE_TURN) {
                await channel.bulkDelete(messageCountToDelete);

                break;
            }

            await channel.bulkDelete(PurgeMessageHandler.MAX_COUNT_OF_MESSAGES_TO_DELETE_IN_ONE_TURN);

            messageCountToDelete -= PurgeMessageHandler.MAX_COUNT_OF_MESSAGES_TO_DELETE_IN_ONE_TURN;
        }
    }
}
