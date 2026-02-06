import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const testSchema = new Schema(
	{
		firstName: String,
		secondName: String,
	},
	{ collection: 'playa' }
);

const testSchema2 = new Schema({
	fileName: String,
	id: Number,
	width: Number,
	height: Number,
});

export default {
	playaSchema: mongoose.model('playa', testSchema),
	imageSchema: mongoose.model('test_image', testSchema2),
};
