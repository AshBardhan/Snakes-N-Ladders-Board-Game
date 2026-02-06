/**
 * Database Seeding Script
 * Run with: node scripts/seed-database.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import adminSchema from '../src/schemas/adminSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playerDataSample = JSON.parse(readFileSync(path.join(__dirname, '../src/data/player.json'), 'utf-8'));
const memeMessageDataSample = JSON.parse(readFileSync(path.join(__dirname, '../src/data/memeMessage.json'), 'utf-8'));

const seedDatabase = async () => {
	try {
		// Connect to MongoDB
		const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/snakes-ladders';
		console.log('🔌 Connecting to MongoDB...');
		await mongoose.connect(mongoURI);
		console.log('✅ Connected to MongoDB:', mongoURI);

		// Clear existing data (optional - comment out to preserve existing data)
		console.log('\n🗑️  Clearing existing data...');
		await adminSchema.playerSchema.deleteMany({});
		await adminSchema.memeMessageSchema.deleteMany({});
		await adminSchema.gameSchema.deleteMany({});
		await adminSchema.gamePlayerSchema.deleteMany({});
		console.log('✅ Existing data cleared');

		// Seed Players
		console.log('\n👥 Seeding players...');
		const players = playerDataSample.map(player => ({
			name: player.name,
			id: player.id,
			position: 0,
			played: 0,
			won: 0,
			selected: false,
			isYours: false,
			isHidden: player.isHidden || false,
		}));

		const insertedPlayers = await adminSchema.playerSchema.insertMany(players);
		console.log(`✅ Inserted ${insertedPlayers.length} players:`);
		insertedPlayers.forEach(player => {
			console.log(`   - ${player.name} (${player.id})${player.isHidden ? ' [HIDDEN]' : ''}`);
		});

		// Seed Meme Messages
		console.log('\n💬 Seeding meme messages...');
		const memeMessages = memeMessageDataSample.map(meme => ({
			type: meme.type,
			playerCount: meme.playerCount,
		}));

		const insertedMemes = await adminSchema.memeMessageSchema.insertMany(memeMessages);
		console.log(`✅ Inserted ${insertedMemes.length} meme message types:`);
		insertedMemes.forEach(meme => {
			console.log(`   - ${meme.type}`);
		});

		// Database Statistics
		console.log('\n📊 Database Statistics:');
		const playerCount = await adminSchema.playerSchema.countDocuments();
		const visiblePlayers = await adminSchema.playerSchema.countDocuments({ isHidden: false });
		const hiddenPlayers = await adminSchema.playerSchema.countDocuments({ isHidden: true });
		const memeCount = await adminSchema.memeMessageSchema.countDocuments();
		const gameCount = await adminSchema.gameSchema.countDocuments();

		console.log(`   Total Players: ${playerCount}`);
		console.log(`   ├─ Visible: ${visiblePlayers}`);
		console.log(`   └─ Hidden: ${hiddenPlayers}`);
		console.log(`   Meme Messages: ${memeCount}`);
		console.log(`   Active Games: ${gameCount}`);

		console.log('\n✨ Database seeded successfully!');
		console.log('\n🎮 You can now start the game with: npm run dev');
		console.log('🔓 Cheat code to unlock hidden players: "bardhanmania"\n');

		process.exit(0);
	} catch (error) {
		console.error('\n❌ Seeding error:', error);
		process.exit(1);
	}
};

// Run the seed function
seedDatabase();
