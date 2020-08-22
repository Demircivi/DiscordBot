import * as Discord from "discord.js";

export enum MessageType {
    REPLY,
    SEND
}

export interface ReplyAndDelegateArguments {
    content: string;
    secondsToWait?: number;
    messageType?: MessageType
}

export default class MiscHelper {
    private readonly static MINIMUM_SECONDS_TO_WAIT = 1;
    private readonly static MAXIMUM_SECONDS_TO_WAIT = 10;

    public static async sleep(milliseconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    public static async sendAndDelete(
        message: Discord.Message,
        options: ReplyAndDelegateArguments
    ) {
        let {
            content,
            secondsToWait = 5,
            messageType = MessageType.REPLY
        } = options;

        let reply: Discord.Message;

        if (messageType === MessageType.REPLY) {
            reply = await message.reply(content);
        } else if (messageType === MessageType.SEND) {
            reply = await message.channel.send(content);
        }

        await this.animateSecondsAndDelete(reply, secondsToWait);
    }

    public static async animateSecondsAndDelete(message: Discord.Message, secondsToWait: number) {
        await this.animateSeconds(message, secondsToWait);
        await message.delete();
    }

    public static async animateSeconds(message: Discord.Message, secondsToWait: number) {
        if (secondsToWait < this.MINIMUM_SECONDS_TO_WAIT || secondsToWait > this.MAXIMUM_SECONDS_TO_WAIT) {
            throw new Error(`secondsToWait must be between 
            ${this.MINIMUM_SECONDS_TO_WAIT} and ${this.MAXIMUM_SECONDS_TO_WAIT}`);
        }

        // TODO: Convert this to a constant value maybe
        const emojis: string[] = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

        while (secondsToWait > 0) {
            await message.react(emojis[secondsToWait - 1]);
            await MiscHelper.sleep(1000);

            secondsToWait--;
        }
    }
}
