var mongoose = require('mongoose');
module.exports = function (config) {
	mongoose.connect('mongodb://' + config.db);
	mongoose.connection;
};
