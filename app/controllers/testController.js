/*
 * GET users listing.
 */

var testSchema = require('../schemas/testSchema');

exports.testSampleList = function (req, res) {
	res.send("respond with a test resource");
}

exports.showSchema = function (req, res) {
	testSchema.playaSchema.find()
			.exec(function (err, playas) {
				if (err) {
					res.status(500).json({status: 'failure'});
				} else {
					console.log(playas);
					res.render('test/index', {
						title: 'playas',
						playas: playas
					});
				}
			});
};

exports.saveSchema = function (req, res) {
	var record = new testSchema.playaSchema(
			{
				firstName: 'Tom',
				secondName: 'Araya'
			}
	);
	record.save(function (err) {
		if (err) {
			console.log(err);
			res.status(500).json({status: 'failure'});
		} else {
			res.json({status: 'success'});
		}
	});
};

exports.showModel = function (req, res) {
	var dataSample = require('../dataSamples/testDataSample');
	var testModel = require('../models/testModel');
	for (var i in dataSample) {
		console.log(testModel(dataSample[i]).getInformation());
	}
	res.render('index', {title: 'Test Express2'});
};

exports.saveModelSchema = function (req, res) {
	var dataSample = require('../dataSamples/testDataSample');
	var testModel = require('../models/testModel');
	for (var i in dataSample) {
		var record = new testSchema.imageSchema(testModel(dataSample[i]).getInformation());
		record.save(function (err) {
			if (err) {
				console.log(err);
				res.status(500).json({status: 'failure'});
			} else {
				console.log('success');
			}
		});
	}
	res.json({status: 'success'});
};

exports.showModelSchema = function (req, res) {
	testSchema.imageSchema.find({fileType: 'avatars'})
			.setOptions({sort: 'fileName'})
			.exec(function (err, images) {
				if (err) {
					res.status(500).json({status: 'failure'});
				} else {
					console.log(images);
					res.render('test/index2', {
						title: 'images',
						images: images
					});
				}
			});
};