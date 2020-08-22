import MessageHandler from "../interfaces/message-handler";
import * as Discord from "discord.js";

export default class AvatarMessageHandler implements MessageHandler {
    private static readonly AVATAR_URL_SIZE = 256;

    aliases: string[] = ["avatar"];
    description: string = "Displays the avatar of mentioned user";

    async execute(message: Discord.Message, args: string[]) {
        const mention = message.mentions.users.first();

        if (!mention) {
            await message.reply("Please mention someone");

            return;
        }

        const avatarURL = mention.avatarURL({size: AvatarMessageHandler.AVATAR_URL_SIZE, dynamic: true});

        if (!avatarURL) {
            await message.reply("User has no profile image");

            return;
        }

        const reply = new Discord.MessageEmbed();

        reply.setDescription("<@" + mention.id + ">'s avatar");
        reply.setImage(avatarURL);

        await message.reply(reply);
    }
}
