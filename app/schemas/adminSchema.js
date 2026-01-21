var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var gameSchema = new Schema({
	name: String,
	dateCreated: Date,
	playerCount: Number,
	isActive: Boolean,
	isOccupied: Boolean,
});
gameSchema.index({ dateCreated: 1 }, { expireAfterSeconds: 3600 });

var playerSchema = new Schema({
	name: String,
	id: String,
	position: Number,
	played: Number,
	won: Number,
	selected: Boolean,
	isYours: Boolean,
	isHidden: Boolean,
});

var imageSchema = new Schema({
	fileName: String,
	id: String,
	width: Number,
	height: Number,
});

var memeMessageSchema = new Schema({
	type: String,
	playerCount: Object,
});

var gamePlayerSchema = new Schema({
	gameID: String,
	playerID: String,
	dateCreated: Date,
});
gamePlayerSchema.index({ dateCreated: 1 }, { expireAfterSeconds: 3600 });

module.exports = {
	gameSchema: mongoose.model('game', gameSchema),
	imageSchema: mongoose.model('image', imageSchema),
	playerSchema: mongoose.model('player', playerSchema),
	gamePlayerSchema: mongoose.model('gamePlayer', gamePlayerSchema),
	memeMessageSchema: mongoose.model('memeMessage', memeMessageSchema),
};
