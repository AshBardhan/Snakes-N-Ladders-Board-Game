/**
 * MongoDB Database Connection
 * Mongoose 8.x compatible connection handler
 */
const mongoose = require('mongoose');

module.exports = function () {
	// MongoDB connection string
	const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/snakes-ladders';

	// Connection options for Mongoose 8.x
	const options = {
		serverSelectionTimeoutMS: 30000,
		socketTimeoutMS: 45000,
		family: 4, // Use IPv4
	};

	// Connect to MongoDB
	mongoose
		.connect(mongoURI, options)
		.then(() => {
			console.log('✓ MongoDB connected successfully');
			console.log(`  Database: ${mongoURI.split('@')[1] || mongoURI.split('//')[1]}`);
		})
		.catch(err => {
			console.error('✗ MongoDB connection error:', err.message);
			console.error('  Please ensure MongoDB is running and the connection string is correct');
			// Don't exit in development to allow frontend testing
			if (process.env.NODE_ENV === 'production') {
				process.exit(1);
			}
		});

	// Connection event handlers
	const db = mongoose.connection;

	db.on('error', err => {
		console.error('MongoDB error:', err.message);
	});

	db.on('disconnected', () => {
		console.warn('MongoDB disconnected. Attempting to reconnect...');
	});

	db.on('reconnected', () => {
		console.log('✓ MongoDB reconnected');
	});

	// Graceful shutdown
	process.on('SIGINT', async () => {
		try {
			await mongoose.connection.close();
			console.log('MongoDB connection closed through app termination');
			process.exit(0);
		} catch (err) {
			console.error('Error closing MongoDB connection:', err);
			process.exit(1);
		}
	});
};
