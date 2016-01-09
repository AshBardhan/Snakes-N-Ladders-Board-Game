var mongoose = require('mongoose');
module.exports = function (config) {
	var options = {
		server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
		replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
	};

	mongoose.connect('mongodb://' + config.db, options);
	var db = mongoose.connection;

	db.on('error', function (err) {
		console.log('connection error', err);
	});

	db.once('open', function () {
		console.log('connected.');
	});
};
