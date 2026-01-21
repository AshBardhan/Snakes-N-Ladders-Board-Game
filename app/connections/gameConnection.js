var adminSchema = require('../schemas/adminSchema'),
	gameModel = require('../models/gameModel'),
	gamePlayerModel = require('../models/gamePlayerModel');

exports.fetchGamePlayers = async function (query, projection, successCallback, errCallback) {
	try {
		const players = await adminSchema.playerSchema
			.find(query, projection)
			.setOptions({ sort: 'id' })
			.exec();
		successCallback(players);
	} catch (err) {
		console.error('Error fetching players:', err);
		errCallback();
	}
};

exports.fetchMemeMessages = async function (query, projection, successCallback, errCallback) {
	try {
		const memeMessages = await adminSchema.memeMessageSchema.find(query, projection).exec();
		successCallback(memeMessages);
	} catch (err) {
		console.error('Error fetching meme messages:', err);
		errCallback();
	}
};

exports.fetchGameList = async function (query, projection, successCallback, errCallback) {
	try {
		const gameList = await adminSchema.gameSchema
			.find(query, projection)
			.sort({ dateCreated: -1 })
			.exec();
		successCallback(gameList);
	} catch (err) {
		console.error('Error fetching game list:', err);
		errCallback();
	}
};

exports.addNewGame = async function (successCallback, errCallback, gameData) {
	try {
		const record = new adminSchema.gameSchema(gameModel(gameData).getInformation());
		await record.save();
		successCallback({ status: 0 });
	} catch (err) {
		console.error('Error adding new game:', err);
		errCallback();
	}
};

exports.updatePlayer = async function (query, incParameter, successCallback, errCallback) {
	try {
		await adminSchema.playerSchema.updateMany(query, { $inc: incParameter }).exec();
		successCallback({ status: 0 });
	} catch (err) {
		console.error('Error updating player:', err);
		errCallback();
	}
};

exports.updateGame = async function (
	query,
	incParameter,
	setParameter,
	successCallback,
	errCallback
) {
	try {
		await adminSchema.gameSchema
			.updateMany(query, { $inc: incParameter, $set: setParameter })
			.exec();
		successCallback({ status: 0 });
	} catch (err) {
		console.error('Error updating game:', err);
		errCallback();
	}
};

exports.addPlayerToGame = async function (successCallback, errCallback, gamePlayerData) {
	try {
		const record = new adminSchema.gamePlayerSchema(
			gamePlayerModel(gamePlayerData).getInformation()
		);
		await record.save();
		successCallback({ status: 'Adding Done' });
	} catch (err) {
		console.error('Error adding player to game:', err);
		errCallback();
	}
};

exports.removePlayerFromGame = async function (query, successCallback, errCallback) {
	try {
		const result = await adminSchema.gamePlayerSchema.findOne(query).exec();
		if (result !== null) {
			await result.deleteOne();
		}
		successCallback({ status: 'Removing Done' });
	} catch (err) {
		console.error('Error removing player from game:', err);
		errCallback();
	}
};

exports.fetchPlayersInGame = async function (query, projection, successCallback, errCallback) {
	try {
		const gamePlayers = await adminSchema.gamePlayerSchema.find(query, projection).exec();
		successCallback(gamePlayers);
	} catch (err) {
		console.error('Error fetching players in game:', err);
		errCallback();
	}
};
