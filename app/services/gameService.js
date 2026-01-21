import * as gameConnection from '../connections/gameConnection.js';

export const fetchGamePlayers = function (successCallback, failureCallback) {
	gameConnection.fetchGamePlayers({}, { _id: 0, __v: 0 }, successCallback, failureCallback);
};

export const fetchMemeMessages = function (successCallback, failureCallback) {
	gameConnection.fetchMemeMessages({}, { _id: 0, __v: 0 }, successCallback, failureCallback);
};

export const fetchGameList = function (successCallback, failureCallback, queryOptions) {
	gameConnection.fetchGameList(queryOptions, { __v: 0 }, successCallback, failureCallback);
};

export const updateGame = function (
	query,
	incOptions,
	setOptions,
	successCallback,
	failureCallback
) {
	gameConnection.updateGame(query, incOptions, setOptions, successCallback, failureCallback);
};

export const addNewGame = function (successCallback, failureCallback, dataOptions) {
	gameConnection.addNewGame(successCallback, failureCallback, dataOptions);
};

export const updatePlayerMatch = function (query, successCallback, failureCallback) {
	gameConnection.updatePlayer(query, { played: 1 }, successCallback, failureCallback);
};

export const updatePlayerWin = function (query, successCallback, failureCallback) {
	gameConnection.updatePlayer(query, { won: 1 }, successCallback, failureCallback);
};

export const addPlayerToGame = function (successCallback, failureCallback, dataOptions) {
	gameConnection.addPlayerToGame(successCallback, failureCallback, dataOptions);
};

export const removePlayerFromGame = function (query, successCallback, failureCallback) {
	gameConnection.removePlayerFromGame(query, successCallback, failureCallback);
};

export const fetchPlayersInGame = function (query, successCallback, failureCallback) {
	gameConnection.fetchPlayersInGame(query, { _id: 0, __v: 0 }, successCallback, failureCallback);
};
