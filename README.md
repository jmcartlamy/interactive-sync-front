# Interactive Sync Front

A Twitch extension connected to the [Twitch API](https://dev.twitch.tv/docs/api) allowing to a viewer to perform chosen actions by developers to use them in twitch plays experiences.

## Using the Twitch Developer Rig

The required path to using this extension is with the [Developer Rig](https://github.com/twitchdev/developer-rig).

## Extension Views

### Running front-end files

In a terminal, install dependencies and run `yarn start` to start the webpack server. 

Then, open your Developer Rig and go on **Extension Views** tab to create your views or refresh them after a change.

### Build a production application

Considering it's to deploy in a host test, run `yarn build`, zip all the files in `dist/` and publish online the application.

## Available Commands

| Command | Description |
|---------|-------------|
| `yarn install` | Install front-end dependencies |
| `yarn start` | Run webpack server in watch mode and emit on `dist/`|
| `yarn build` | Build webpack server and emit on `dist/` |

