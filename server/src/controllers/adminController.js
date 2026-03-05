import adminSchema from '../schemas/adminSchema.js';
import playerDataJson from '../data/player.json' with { type: 'json' };
import playerModel from '../models/playerModel.js';

const showSchema = async function (req, res) {
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

const saveSchema = async function (req, res) {
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

const showModel = function (req, res) {
	const dataSample = playerDataJson;
	const testModel = playerModel;
	for (var i in dataSample) {
		console.log(testModel(dataSample[i]).getInformation());
	}
	res.json(dataSample);
};

const savePlayerModelSchema = async function (req, res) {
	try {
		const dataSample = playerDataJson;
		const testModel = playerModel;
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

/**
 * Complete Database Seeding
 * Seeds all initial data: players
 */
const seedDatabase = async function (req, res) {
	try {
		console.log('🌱 Starting database seed...');
		const results = {
			players: { inserted: 0, skipped: 0, errors: [] },
		};

		// Seed Players
		console.log('👥 Seeding players...');
		const playerDataSample = playerDataJson;
		const playerModelFunc = playerModel;

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
					const playerInfo = playerModelFunc(playerData).getInformation();
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

		// Get final counts
		const playerCount = await adminSchema.playerSchema.countDocuments();
		const visiblePlayers = await adminSchema.playerSchema.countDocuments({ isHidden: false });
		const hiddenPlayers = await adminSchema.playerSchema.countDocuments({ isHidden: true });

		console.log('\n✨ Database seeding completed!');
		console.log(`Players: ${playerCount} total (${visiblePlayers} visible, ${hiddenPlayers} hidden)`);

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
const resetDatabase = async function (req, res) {
	try {
		console.log('🔄 Resetting database...');

		// Clear all collections
		await adminSchema.playerSchema.deleteMany({});
		await adminSchema.gameSchema.deleteMany({});
		await adminSchema.gamePlayerSchema.deleteMany({});
		console.log('✅ All collections cleared');

		// Re-seed the database
		await seedDatabase(req, res);
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
const getDatabaseStats = async function (req, res) {
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

export default {
	showSchema,
	saveSchema,
	showModel,
	savePlayerModelSchema,
	seedDatabase,
	resetDatabase,
	getDatabaseStats,
};
