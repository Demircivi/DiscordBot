# DiscordBot

![Application](https://raw.githubusercontent.com/Demircivi/DiscordBot/master/repository/bot.gif)

## Table Of Contents
* [About](#about)
  * [Dependencies Used](#dependencies-used)
* [Installation](#installation)
  * [Configuration](#configuration)
  * [Installing Dependencies](#installing-dependencies)
  * [Launching The Project](#launching-the-project)
    * [Development Mode](#development-mode)
    * [Production Mode](#production-mode)
* [License](#license)

## About

This repository contains a Discord example bot that consists of several commands:

| Command                 | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| -avatar                 | Displays the avatar of mentioned user                        |
| -hi, -hello             | Bot says hello                                               |
| -minecraft, -mc         | Shows the server details of the given host(optional, default is: minecraft.emredemircivi.com) and port(optional, default is: 25565) |
| -purge, -delete, -clear | Deletes specified amount of messages from the channel        |

### Dependencies Used
* [axios](https://github.com/axios/axios)
* [discord.js](https://github.com/discordjs/discord.js/)
* [ts-node](https://github.com/TypeStrong/ts-node) and [ts-node-dev](https://github.com/whitecolor/ts-node-dev)
* [TypeScript](https://github.com/microsoft/TypeScript)

## Installation

⚠️ Make sure you've **NPM** and **Node** installed.

Open a terminal window and clone the repository. After cloning the repository change your directory to the repository directory.

### Configuration

Open up the `config.json` file located in `src/config` directory in your favorite text editor and put your Discord bot token to the `token` field then save the file.

### Installing Dependencies

Install project dependencies by executing the following command:

```bash
npm install
```

We're done with installing dependencies.

### Launching The Project

#### Development Mode

If you're going to develop the project in your local environment you can type the following command to run the project in the development mode so when there is a change in your code, the application will restart automatically:

```bash
npm run watch
```

#### Production Mode

Type the following command to start the project in production mode:

```bash
npm run start
```

## License

[MIT](MIT)

