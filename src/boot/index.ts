import * as Discord from "discord.js";
import {PresenceData} from "discord.js";
import MessageHandlerManager from "../managers/message-handler-manager";
import ConfigManager from "../config/config-manager";

export default class Boot {
    private static client: Discord.Client;

    public static async boot() {
        await ConfigManager.load();
        await this.createClient();
    }

    private static async createClient() {
        Boot.client = new Discord.Client();

        Boot.client.on("ready", async () => {
            await this.loadManagers();
            await this.setPresence();

            console.log("Bot is ready");
        });

        await Boot.client.login(ConfigManager.config.token);
    }

    private static async loadManagers() {
        new MessageHandlerManager(
            Boot.client
        );
    }

    private static async setPresence() {
        const presence: PresenceData = {
            status: "online",
            activity: {
                type: "LISTENING",
                name: "for commands"
            }
        };

        await Boot.client.user.setPresence(presence);
    }
}
