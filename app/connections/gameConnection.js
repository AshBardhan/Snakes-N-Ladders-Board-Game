var adminSchema = require('../schemas/adminSchema'),
		gameModel = require('../models/gameModel'),
		gamePlayerModel = require('../models/gamePlayerModel');

exports.fetchGamePlayers = function (query, projection, successCallback, errCallback) {
	adminSchema.playerSchema.find(query, projection)
			.setOptions({sort: 'id'})
			.exec(function (err, players) {
				if (err) {
					errCallback();
				} else {
					successCallback(players);
				}
			});
};

exports.fetchMemeMessages = function (query, projection, successCallback, errCallback) {
	adminSchema.memeMessageSchema.find(query, projection)
			.exec(function (err, memeMessages) {
				if (err) {
					errCallback();
				} else {
					successCallback(memeMessages);
				}
			});
};

exports.fetchGameList = function (query, projection, successCallback, errCallback) {
	adminSchema.gameSchema.find(query, projection).sort({'dateCreated': -1})
			.exec(function (err, gameList) {
				if (err) {
					errCallback();
				} else {
					successCallback(gameList);
				}
			});
};

exports.addNewGame = function (successCallback, errCallback, gameData) {
	var record = new adminSchema.gameSchema(gameModel(gameData).getInformation());
	record.save(function (err) {
		if (err) {
			errCallback();
		}
	});
	successCallback({status: 0});
};

exports.updatePlayer = function (query, incParameter, successCallback, errCallback) {
	adminSchema.playerSchema.find(query)
			.update({$inc: incParameter}, function (err) {
				if (err) {
					errCallback();
				} else {
					successCallback({status: 0});
				}
			});
};

exports.updateGame = function (query, incParameter, setParameter, successCallback, errCallback) {
	adminSchema.gameSchema.find(query)
			.update({$inc: incParameter, $set: setParameter}, function (err) {
				if (err) {
					errCallback();
				} else {
					successCallback({status: 0});
				}
			});
};

exports.addPlayerToGame = function (successCallback, errCallback, gamePlayerData) {
	var record = new adminSchema.gamePlayerSchema(gamePlayerModel(gamePlayerData).getInformation());
	record.save(function (err) {
		if (err) {
			errCallback();
		}
	});
	successCallback({status: 'Adding Done'});
};

exports.removePlayerFromGame = function (query, successCallback, errCallback) {
	adminSchema.gamePlayerSchema.findOne(query, function (err, result) {
		if (err) {
			errCallback();
		} else {
			if (result !== null) {
				result.remove();
			}
			successCallback({status: 'Removing Done'});
		}
	});
};

exports.fetchPlayersInGame = function (query, projection, successCallback, errCallback) {
	adminSchema.gamePlayerSchema.find(query, projection)
			.exec(function (err, gamePlayers) {
				if (err) {
					errCallback();
				} else {
					successCallback(gamePlayers);
				}
			});
};
