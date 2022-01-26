# Interactive Sync Front

A Twitch extension connected to the [Twitch API](https://dev.twitch.tv/docs/api) allowing to a viewer to perform chosen actions by developers to use them in twitch plays experiences, paired with the [Extension Backend Service (EBS)](https://github.com/jmcartlamy/interactive-sync-ebs).

See the [Interactive Sync documentation](https://www.interactive-sync.com/docs) for more details!

## Use the Twitch Developer Rig

The required way to using this boilerplate is with the [Developer Rig](https://dev.twitch.tv/docs/extensions/rig).

## Extension Views

### Create your Extension

Go on your [Twitch Developers](https://dev.twitch.tv/console/extensions) and register an extension:

-   Choose your name and click on "Continue",
-   Fill the form and select these Extension Types: "Panel", "Video Fullscreen" and "Mobile",
-   Create your first version of your extension.

### Configure your front-end files

Log in on your **Developer Rig** and follow these steps:

-   Click on "Create your first project",
-   Select the newly created extension, then click on "Next",
-   Select the local folder which will contain your front-end code / the EBS, and don't select a template,
-   On "Next", your extension project was successfully created!

In a terminal, clone the repository on your local folder and install dependencies with `yarn install`.

On the **Project Details**, enter the path to the front-end files. It probably looks like `LOCAL_FOLDER\interactive-sync-front\dist`.

### Running your front-end files

It is recommended to use the terminal to run the front-end files.

Run `yarn start` to start the webpack server and go on **Extension Views** tab to create your views or refresh them after a change.

## Build a production application

Considering it's to deploy in a host test, run `yarn build`, zip all the files in `dist/` and publish online the application.

## Available Commands

| Command        | Description                                          |
| -------------- | ---------------------------------------------------- |
| `yarn install` | Install front-end dependencies                       |
| `yarn start`   | Run webpack server in watch mode and emit on `dist/` |
| `yarn build`   | Build webpack server and emit on `dist/`             |
