/*
 * GET users listing.
 */

var adminSchema = require('../schemas/adminSchema'),
		gameService = require('../services/gameService'),
		cheatCodes = require('../dataSamples/codeDataSample'),
		env = process.env.NODE_ENV || 'dev';


exports.showSnakeAndLaddersGame = function (req, res) {
	res.render('home', { fileExtn: env === 'prod' ? '.min' : '' });
	//adminSchema.playerSchema.find()
	//		.setOptions({sort: 'id'})
	//		.exec(function (err, players) {
	//			if (err) {
	//				res.status(500).json({status: 'failure'});
	//			} else {
	//				res.render('home', {
	//					players: players,
	//					fileExtn: env === 'prod' ? '.min' : ''
	//				});
	//			}
	//		});
};

exports.getGamePartialView = function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};

exports.fetchGamePlayers = function (req, res) {
	var success = function (players) {
		res.json(players);
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	gameService.fetchGamePlayers(success, failure);
};

exports.fetchMemeMessages = function (req, res) {
	var success = function (memeMessages) {
		res.json(memeMessages);
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	gameService.fetchMemeMessages(success, failure);
};

exports.fetchGameList = function (req, res) {
	var options = {'isOccupied': false};
	var success = function (games) {
		res.json(games);
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	gameService.fetchGameList(success, failure, options);
};

exports.addGameToList = function (req, res) {
	var options = {'isOccupied': false};
	var body = req.body;
	if (typeof body !== 'undefined') {
		for (var prop in body) {
			options[prop] = body[prop];
		}
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	var addSuccess = function (result) {
		res.json(result);
	}
	var searchSuccess = function (games) {
		if (games.length == 0) {
			gameService.addNewGame(addSuccess, failure, options);
		} else {
			res.json({status: 1, errMsg: 'This name has already been taken'});
		}
	}
	gameService.fetchGameList(searchSuccess, failure, options);
};

exports.togglePlayerInGame = function (req, res) {
	var options = {};
	var body = req.body;
	var playerInGameType, playerCount;
	if (typeof body !== 'undefined') {
		for (var prop in body) {
			if (prop === 'type') {
				playerInGameType = body[prop];
			} else if (prop === 'playerCount') {
				playerCount = body[prop];
			} else {
				options[prop] = body[prop];
			}
		}
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	var successGameUpdate = function (result) {
		res.json(result);

	}
	var successPlayerToggle = function (result) {
		gameService.updateGame({'_id': options.gameID}, {'playerCount': playerInGameType == 'add' ? 1 : -1}, {'isOccupied': playerInGameType == 'add' && playerCount == 3}, successGameUpdate, failure);
	}
	if (playerInGameType === 'add')
		gameService.addPlayerToGame(successPlayerToggle, failure, options);
	else
		gameService.removePlayerFromGame(options, successPlayerToggle, failure);
};

exports.fetchPlayersInGame = function (req, res) {
	var gameID = req.query.gameID;
	var success = function (result) {
		res.json(result)
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	gameService.fetchPlayersInGame({'gameID': gameID}, success, failure)
};

exports.updateGameOccupied = function (req, res) {
	var gameID = req.query.gameID;
	var success = function (result) {
		res.json(result)
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	gameService.updateGame({'_id': gameID}, {}, {'isOccupied': true}, success, failure)
};

exports.updatePlayerMatch = function (req, res) {
	var players = decodeURIComponent(req.query.players).split(',');
	var success = function (result) {
		res.json(result)
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	for (var i in players) {
		var playerID = players[i];
		gameService.updatePlayerMatch({'id': playerID}, success, failure);
	}
};

exports.updatePlayerWin = function (req, res) {
	var playerID = req.query.player;
	var success = function (result) {
		res.json(result)
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	gameService.updatePlayerWin({'id': playerID}, success, failure);
};

exports.joinGame = function (req, res) {
	var options = {'isOccupied': false};
	var body = req.body;
	if (typeof body !== 'undefined') {
		for (var prop in body) {
			options[prop] = body[prop];
		}
	}
	var failure = function () {
		res.status(500).json({status: 'failure'});
	}
	var addSuccess = function (result) {
		res.json(result);
	}
	var searchSuccess = function (games) {
		if (games.length == 0) {
			res.json({status: 1, errMsg: 'This game has been occupied'});
		} else {
			res.json({status: 0});
			/*res.json(result);
			 console.log(games);
			 var setOptions = {};
			 if (games[0].playerCount == 3)
			 setOptions['isOccupied'] = true;
			 gameService.updateGame(options, {'playerCount': 1}, setOptions, addSuccess, failure);*/
		}
	}
	gameService.fetchGameList(searchSuccess, failure, options);
};

exports.checkCheatCode = function (req, res) {
	var charCode = req.body.charCode;
	var posn = Number(req.body.posn);
	if (cheatCodes.unlockPlayersCheat.charCodeAt(posn) - 32 == charCode) {
		posn += 1;
		if (posn === cheatCodes.unlockPlayersCheat.length) {
			posn = -1;
		}
	} else {
		posn = 0;
	}
	res.json({status: posn});
};