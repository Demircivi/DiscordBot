import MessageHandler from "../interfaces/message-handler";
import * as Discord from "discord.js";
import * as net from "net";
import MiscHelper from "../../../helpers/misc-helper";
import StringHelper from "../../../helpers/string-helper";
import ConfigManager from "../../../config/config-manager";

interface ServerStatus {
    version: string;
    motd: string;
    currentPlayers: number;
    maximumPlayers: number;
}

export default class MinecraftMessageHandler implements MessageHandler {
    private static readonly EXPECTED_ARGUMENT_COUNT_FROM_SERVER = 6;
    private static readonly CONNECT_TIMEOUT_SECONDS = 5;
    private static readonly MAXIMUM_ARG_COUNT = 2;
    private static readonly MINIMUM_PORT_VALUE = 0;
    private static readonly MAXIMUM_PORT_VALUE = 65535;

    aliases: string[] = ["minecraft", "mc"];
    description: string = `Shows the server details of the given ` +
        `host(optional, default is: ${ConfigManager.config.defaultMinecraftServer.host}) and ` +
        `port(optional, default is: ${ConfigManager.config.defaultMinecraftServer.port})`;

    async execute(message: Discord.Message, args: string[]) {
        if (args.length > MinecraftMessageHandler.MAXIMUM_ARG_COUNT) {
            await MiscHelper.sendAndDelete(
                message, {
                    content: `Argument can be ${MinecraftMessageHandler.MAXIMUM_ARG_COUNT} at maximum`
                }
            );

            return;
        }

        let host = ConfigManager.config.defaultMinecraftServer.host;
        let port: number = ConfigManager.config.defaultMinecraftServer.port;

        if (args.length !== 0) {
            host = args[0];
        }

        if (args.length === 2) {
            const portString = args[1];

            if (!StringHelper.isStringBuildWithNumbersOnly(portString)) {
                await MiscHelper.sendAndDelete(message, {
                    content: "Port must contain numbers only"
                });

                return;
            }

            port = Number(portString);

            if (port < MinecraftMessageHandler.MINIMUM_PORT_VALUE ||
                port > MinecraftMessageHandler.MAXIMUM_PORT_VALUE) {
                await MiscHelper.sendAndDelete(
                    message, {
                        content: `Port must be between ${MinecraftMessageHandler.MINIMUM_PORT_VALUE} ` +
                            `and ${MinecraftMessageHandler.MAXIMUM_PORT_VALUE}`
                    }
                );

                return;
            }
        }

        let status: ServerStatus;

        try {
            status = await this.getServerState(host, port);
        } catch (error) {
            const reply = new Discord.MessageEmbed();

            reply.setTitle("⚫️ Server is offline");
            reply.setDescription(`Server can't be reached on ${host}:${port}`)

            await message.reply(reply);

            return;
        }

        const reply = new Discord.MessageEmbed();

        reply.setTitle("🟢 Server is online");
        reply.setDescription(`**Host**: ${host}\n**Port**: ${port}\n**Description**: ${status.motd}`);
        reply.addField("**Version**", status.version, true);
        reply.addField("**Online Players**", `${status.currentPlayers}/${status.maximumPlayers}`, true);

        await message.reply(reply);
    }

    private async getServerState(host: string, port: number): Promise<ServerStatus> {
        return new Promise((resolve, reject) => {
            const client = net.connect(port, host, () => {
                const serverListRequestPayload = [0xFE, 0x01];

                client.write(Buffer.from(serverListRequestPayload));
            });

            client.setTimeout(MinecraftMessageHandler.CONNECT_TIMEOUT_SECONDS * 1000)

            client.on("data", data => {
                const serverInfo = data.toString().split('\x00\x00\x00');

                if (!serverInfo || serverInfo.length !== MinecraftMessageHandler.EXPECTED_ARGUMENT_COUNT_FROM_SERVER) {
                    reject(new Error("Invalid argument count received from server"));

                    return;
                }

                const regexValue = /\u0000/g;

                const version = serverInfo[2].replace(regexValue, '');
                const motd = serverInfo[3].replace(regexValue, '');
                const currentPlayers = Number(serverInfo[4].replace(regexValue, ''));
                const maximumPlayers = Number(serverInfo[5].replace(regexValue, ''));

                client.end();

                resolve({version, motd, currentPlayers, maximumPlayers} as ServerStatus);
            });

            client.on("timeout", () => {
                client.end();

                reject(new Error("Network timeout"));
            });

            client.on("error", error => {
                reject(error);
            });
        });
    }
}
