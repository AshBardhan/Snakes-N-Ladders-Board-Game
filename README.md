Snakes-N-Ladders-Board-Game
============================

> This is a Web Project on **Snakes-N-Ladders** Board Game developed in NodeJS Express Framework.

Installation
===========================
1. Clone the complete codebase into your preferred location.
2. Download and Install latest versions of `NodeJS` and `MongoDB`.
3. (Optional) Import this project into `IntelliJ IDEA` or `Webstorm` IDE as `Node ExpressJS` project.
4. Open Command Prompt (Windows) or Terminal (Linux/Mac) from the location of your project and type the following commands
	- `npm install` for downloading all the required `node_modules` packages.
	- `bower install` for downloading all the required `bower_components` packages.
5. For IDEA developers, proceed the following steps
	- Create/Edit the NodeJS configuration settings.
	- Fill up the location of your node.exe file in `Node Interpreter` section.
	- Skip the `Node Parameters` section.
	- Fill up your project location in `Working Directory` section.
	- Fill up `server.js` in the `JavaScript File` location.
6. Set up an `Environment Variable` named `NODE_ENV` with value `dev` or `prod` for developer/production purposes.
7. To run the app, IDEA developers can launch the server which was configured in Step 4. Otherwise, use the command `node server.js` in your project location.
8. **(Additional step)** If you want to create your own local `database`, Visit the following links (only one) in order to fetch initial data into your `MongoDB` database.
	- `http://localhost:3000/admin/player/save-model-schema-test`, it stores Player data.
	- `http://localhost:3000/admin/meme/save-model-schema-test`, it stores Game Meme Message.