var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var testSchema = new Schema(
	{
		firstName: String,
		secondName: String,
	},
	{ collection: 'playa' }
);

var testSchema2 = new Schema({
	fileName: String,
	id: Number,
	width: Number,
	height: Number,
});

module.exports = {
	playaSchema: mongoose.model('playa', testSchema),
	imageSchema: mongoose.model('test_image', testSchema2),
};
