interface Config {
    readonly token: string;
    readonly commandPrefix: string;
    readonly enableUnknownCommandMessage: boolean;
    readonly maximumMessageCountToPurge: number;
    readonly defaultMinecraftServer: {
        readonly host: string;
        readonly port: number;
    }
}

export default class ConfigManager {
    private static _config: Config;

    public static get config(): Config {
        return this._config;
    }

    public static async load() {
        this._config = require(__dirname + "/config.json");

        this.makeSureTokenExists();
    }

    private static makeSureTokenExists() {
        if (!this.config.token) {
            throw new Error("Token was not set.");
        }
    }
}
