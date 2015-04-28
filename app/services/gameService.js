var gameConnection = require('../connections/gameConnection');

exports.fetchGamePlayers = function (successCallback, failureCallback) {
	gameConnection.fetchGamePlayers({}, {"_id": 0, "__v": 0}, successCallback, failureCallback);
};

exports.fetchMemeMessages = function (successCallback, failureCallback) {
	gameConnection.fetchMemeMessages({}, {"_id": 0, "__v": 0}, successCallback, failureCallback);
};

exports.fetchGameList = function (successCallback, failureCallback, queryOptions) {
	gameConnection.fetchGameList(queryOptions, {"__v": 0}, successCallback, failureCallback);
};

exports.updateGame = function (query, incOptions, setOptions, successCallback, failureCallback) {
	gameConnection.updateGame(query, incOptions, setOptions, successCallback, failureCallback);
};

exports.addNewGame = function (successCallback, failureCallback, dataOptions) {
	gameConnection.addNewGame(successCallback, failureCallback, dataOptions);
};

exports.updatePlayerMatch = function (query, successCallback, failureCallback) {
	gameConnection.updatePlayer(query, {'played': 1}, successCallback, failureCallback);
};

exports.updatePlayerWin = function (query, successCallback, failureCallback) {
	gameConnection.updatePlayer(query, {'won': 1}, successCallback, failureCallback);
};

exports.addPlayerToGame = function (successCallback, failureCallback, dataOptions) {
	gameConnection.addPlayerToGame(successCallback, failureCallback, dataOptions);
};

exports.removePlayerFromGame = function (query, successCallback, failureCallback) {
	gameConnection.removePlayerFromGame(query, successCallback, failureCallback);
};

exports.fetchPlayersInGame = function (query, successCallback, failureCallback) {
	gameConnection.fetchPlayersInGame(query, {"_id": 0, "__v": 0}, successCallback, failureCallback);
};
