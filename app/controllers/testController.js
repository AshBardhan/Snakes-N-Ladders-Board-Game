/*
 * GET users listing.
 */

import testSchema from '../schemas/testSchema.js';
import testDataSample from '../data/test.json' with { type: 'json' };
import testModel from '../models/testModel.js';

const testSampleList = function (req, res) {
	res.send('respond with a test resource');
};

const showSchema = function (req, res) {
	testSchema.playaSchema.find().exec(function (err, playas) {
		if (err) {
			res.status(500).json({ status: 'failure' });
		} else {
			console.log(playas);
			res.render('test/index', {
				title: 'playas',
				playas: playas,
			});
		}
	});
};

const saveSchema = function (req, res) {
	var record = new testSchema.playaSchema({
		firstName: 'Tom',
		secondName: 'Araya',
	});
	record.save(function (err) {
		if (err) {
			console.log(err);
			res.status(500).json({ status: 'failure' });
		} else {
			res.json({ status: 'success' });
		}
	});
};

const showModel = function (req, res) {
	const dataSample = testDataSample;
	const testModelFunc = testModel;
	for (var i in dataSample) {
		console.log(testModelFunc(dataSample[i]).getInformation());
	}
	res.render('index', { title: 'Test Express2' });
};

const saveModelSchema = function (req, res) {
	const dataSample = testDataSample;
	const testModelFunc = testModel;
	for (var i in dataSample) {
		var record = new testSchema.imageSchema(testModelFunc(dataSample[i]).getInformation());
		record.save(function (err) {
			if (err) {
				console.log(err);
				res.status(500).json({ status: 'failure' });
			} else {
				console.log('success');
			}
		});
	}
	res.json({ status: 'success' });
};

const showModelSchema = function (req, res) {
	testSchema.imageSchema
		.find()
		.setOptions({ sort: 'fileName' })
		.exec(function (err, images) {
			if (err) {
				res.status(500).json({ status: 'failure' });
			} else {
				console.log(images);
				res.render('test/index2', {
					title: 'images',
					images: images,
				});
			}
		});
};

export default {
	showSchema,
	saveSchema,
	showModel,
	showModelSchema,
	saveModelSchema,
	testSampleList,
};
