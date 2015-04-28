/*
 * GET home page.
 */

var urls = require('./app/enums/urlConstants').urls;
module.exports = function (app) {
	var gameController = require('./app/controllers/gameController');
	app.get(urls.WEB.SNAKES_N_LADDERS, gameController.showSnakeAndLadders);
	app.get(urls.API.FETCH_PLAYER_LIST, gameController.fetchGamePlayers);
	app.get(urls.API.FETCH_MEME_MESSAGE_LIST, gameController.fetchMemeMessages);
	app.get(urls.API.UPDATE_PLAYER_PLAYED, gameController.updatePlayerMatch);
	app.get(urls.API.UPDATE_PLAYER_WON, gameController.updatePlayerWin);
	app.get(urls.API.FETCH_GAME_LIST, gameController.fetchGameList);
	app.get(urls.API.UPDATE_GAME, gameController.updateGameOccupied);
	app.post(urls.API.ADD_NEW_GAME, gameController.addGameToList);
	app.post(urls.API.JOIN_GAME, gameController.joinGame);
	app.post(urls.API.CHECK_CHEAT_CODE, gameController.checkCheatCode);
	app.post(urls.API.TOGGLE_PLAYER_IN_GAME, gameController.togglePlayerInGame);
	app.get(urls.API.FETCH_PLAYER_IN_GAME, gameController.fetchPlayersInGame);

	var testController = require('./app/controllers/testController');
	app.get(urls.TEST.SHOW_SCHEMA, testController.showSchema);
	app.get(urls.TEST.SAVE_SCHEMA, testController.saveSchema);
	app.get(urls.TEST.SHOW_MODEL, testController.showModel);
	app.get(urls.TEST.SHOW_MODEL_SCHEMA, testController.showModelSchema);
	app.get(urls.TEST.SAVE_MODEL_SCHEMA, testController.saveModelSchema);
	app.get(urls.TEST.GET_LIST, testController.testSampleList);

	var adminController = require('./app/controllers/adminController');
	app.get(urls.ADMIN.SHOW_SCHEMA, adminController.showSchema);
	app.get(urls.ADMIN.SAVE_SCHEMA, adminController.saveSchema);
	app.get(urls.ADMIN.SHOW_MODEL, adminController.showModel);
	app.get(urls.ADMIN.SHOW_MODEL_SCHEMA, adminController.showModelSchema);
	app.get(urls.ADMIN.SAVE_MODEL_SCHEMA, adminController.saveModelSchema);
	app.get(urls.ADMIN.SAVE_MEME_MODEL_SCHEMA, adminController.saveMemeModelSchema);
	app.get(urls.ADMIN.SAVE_PLAYER_MODEL_SCHEMA, adminController.savePlayerModelSchema);
};