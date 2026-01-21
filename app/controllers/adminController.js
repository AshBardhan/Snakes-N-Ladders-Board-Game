var adminSchema = require('../schemas/adminSchema');

exports.showSchema = async function (req, res) {
	try {
		const results = await adminSchema.playerSchema.find().setOptions({ sort: 'id' }).exec();
		console.log(results);
		res.render('admin/index', {
			title: 'results',
			results: results,
		});
	} catch (err) {
		console.error('Error in showSchema:', err);
		res.status(500).json({ status: 'failure' });
	}
};

exports.saveSchema = async function (req, res) {
	try {
		const record = new adminSchema.playerSchema({
			name: 'Ashish',
			id: 'p-8',
			position: 0,
			played: 0,
			won: 0,
			selected: false,
			isYours: false,
			isHidden: true,
		});
		await record.save();
		res.json({ status: 'success' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: 'failure' });
	}
};

exports.showModel = function (req, res) {
	var dataSample = require('../data/player.json');
	var testModel = require('../models/playerModel');
	for (var i in dataSample) {
		console.log(testModel(dataSample[i]).getInformation());
	}
	res.json(dataSample);
};

exports.saveModelSchema = async function (req, res) {
	try {
		const dataSample = require('../data/memeMessage.json');
		const testModel = require('../models/memeMessageModel');
		for (var i in dataSample) {
			const record = new adminSchema.memeMessageSchema(testModel(dataSample[i]).getInformation());
			await record.save();
			console.log('success');
		}
		res.json({ status: 'success' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: 'failure' });
	}
};

exports.showModelSchema = async function (req, res) {
	try {
		const results = await adminSchema.memeMessageSchema.find().setOptions({ sort: 'id' }).exec();
		console.log(results);
		res.render('admin/index', {
			title: 'results',
			results: results,
		});
	} catch (err) {
		console.error('Error in showModelSchema:', err);
		res.status(500).json({ status: 'failure' });
	}
};

exports.savePlayerModelSchema = async function (req, res) {
	try {
		const dataSample = require('../data/player.json');
		const testModel = require('../models/playerModel');
		for (var i in dataSample) {
			const record = new adminSchema.playerSchema(testModel(dataSample[i]).getInformation());
			await record.save();
			console.log('success');
		}
		res.json({ status: 'success' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: 'failure' });
	}
};

exports.saveMemeModelSchema = async function (req, res) {
	try {
		const dataSample = require('../data/memeMessage.json');
		const testModel = require('../models/memeMessageModel');
		for (var i in dataSample) {
			const record = new adminSchema.memeMessageSchema(testModel(dataSample[i]).getInformation());
			await record.save();
			console.log('success');
		}
		res.json({ status: 'success' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: 'failure' });
	}
};

/**
 * Complete Database Seeding
 * Seeds all initial data: players and meme messages
 */
exports.seedDatabase = async function (req, res) {
	try {
		console.log('🌱 Starting database seed...');
		const results = {
			players: { inserted: 0, skipped: 0, errors: [] },
			memeMessages: { inserted: 0, skipped: 0, errors: [] },
		};

		// Seed Players
		console.log('👥 Seeding players...');
		const playerDataSample = require('../data/player.json');
		const playerModel = require('../models/playerModel');

		for (const playerData of playerDataSample) {
			try {
				// Check if player already exists
				const existingPlayer = await adminSchema.playerSchema.findOne({ id: playerData.id });

				if (existingPlayer) {
					console.log(
						`   ⏭️  Player ${playerData.name} (${playerData.id}) already exists, skipping`
					);
					results.players.skipped++;
				} else {
					const playerInfo = playerModel(playerData).getInformation();
					const record = new adminSchema.playerSchema(playerInfo);
					await record.save();
					console.log(`   ✅ Added player: ${playerData.name} (${playerData.id})`);
					results.players.inserted++;
				}
			} catch (err) {
				console.error(`   ❌ Error adding player ${playerData.name}:`, err.message);
				results.players.errors.push({ player: playerData.name, error: err.message });
			}
		}

		// Seed Meme Messages
		console.log('💬 Seeding meme messages...');
		const memeMessageDataSample = require('../data/memeMessage.json');
		const memeMessageModel = require('../models/memeMessageModel');

		for (const memeData of memeMessageDataSample) {
			try {
				// Check if meme message type already exists
				const existingMeme = await adminSchema.memeMessageSchema.findOne({ type: memeData.type });

				if (existingMeme) {
					console.log(`   ⏭️  Meme message type '${memeData.type}' already exists, skipping`);
					results.memeMessages.skipped++;
				} else {
					const memeInfo = memeMessageModel(memeData).getInformation();
					const record = new adminSchema.memeMessageSchema(memeInfo);
					await record.save();
					console.log(`   ✅ Added meme message type: ${memeData.type}`);
					results.memeMessages.inserted++;
				}
			} catch (err) {
				console.error(`   ❌ Error adding meme message ${memeData.type}:`, err.message);
				results.memeMessages.errors.push({ type: memeData.type, error: err.message });
			}
		}

		// Get final counts
		const playerCount = await adminSchema.playerSchema.countDocuments();
		const visiblePlayers = await adminSchema.playerSchema.countDocuments({ isHidden: false });
		const hiddenPlayers = await adminSchema.playerSchema.countDocuments({ isHidden: true });
		const memeCount = await adminSchema.memeMessageSchema.countDocuments();

		console.log('\n✨ Database seeding completed!');
		console.log(
			`   Players: ${playerCount} total (${visiblePlayers} visible, ${hiddenPlayers} hidden)`
		);
		console.log(`   Meme Messages: ${memeCount} types`);

		res.json({
			status: 'success',
			message: 'Database seeded successfully',
			summary: {
				players: {
					total: playerCount,
					visible: visiblePlayers,
					hidden: hiddenPlayers,
					inserted: results.players.inserted,
					skipped: results.players.skipped,
					errors: results.players.errors.length,
				},
				memeMessages: {
					total: memeCount,
					inserted: results.memeMessages.inserted,
					skipped: results.memeMessages.skipped,
					errors: results.memeMessages.errors.length,
				},
			},
			details: results,
		});
	} catch (err) {
		console.error('❌ Database seeding error:', err);
		res.status(500).json({
			status: 'failure',
			error: err.message,
			message: 'Failed to seed database',
		});
	}
};

/**
 * Reset Database
 * Clears all data and reseeds
 */
exports.resetDatabase = async function (req, res) {
	try {
		console.log('🔄 Resetting database...');

		// Clear all collections
		await adminSchema.playerSchema.deleteMany({});
		await adminSchema.memeMessageSchema.deleteMany({});
		await adminSchema.gameSchema.deleteMany({});
		await adminSchema.gamePlayerSchema.deleteMany({});
		console.log('✅ All collections cleared');

		// Re-seed the database
		await exports.seedDatabase(req, res);
	} catch (err) {
		console.error('❌ Database reset error:', err);
		res.status(500).json({
			status: 'failure',
			error: err.message,
			message: 'Failed to reset database',
		});
	}
};

/**
 * Get Database Statistics
 */
exports.getDatabaseStats = async function (req, res) {
	try {
		const stats = {
			players: {
				total: await adminSchema.playerSchema.countDocuments(),
				visible: await adminSchema.playerSchema.countDocuments({ isHidden: false }),
				hidden: await adminSchema.playerSchema.countDocuments({ isHidden: true }),
				list: await adminSchema.playerSchema
					.find({}, { name: 1, id: 1, isHidden: 1, played: 1, won: 1, _id: 0 })
					.sort('id'),
			},
			games: {
				total: await adminSchema.gameSchema.countDocuments(),
				active: await adminSchema.gameSchema.countDocuments({ isOccupied: true }),
				waiting: await adminSchema.gameSchema.countDocuments({ isOccupied: false }),
			},
			memeMessages: {
				total: await adminSchema.memeMessageSchema.countDocuments(),
				types: await adminSchema.memeMessageSchema.find({}, { type: 1, _id: 0 }),
			},
			gamePlayers: {
				total: await adminSchema.gamePlayerSchema.countDocuments(),
			},
		};

		res.json({
			status: 'success',
			stats: stats,
		});
	} catch (err) {
		console.error('❌ Error fetching database stats:', err);
		res.status(500).json({
			status: 'failure',
			error: err.message,
		});
	}
};
