/**
 * Snakes & Ladders Game Server
 * Express 4.x with ES6+ enhancements
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import favicon from 'serve-favicon';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './app/connections/utils/dbConnection.js';
import connectSocket from './app/connections/utils/gameSocketConnection.js';
import routes from './routes.js';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Environment Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'dev';

// Security & Performance Middleware
app.use(
	helmet({
		contentSecurityPolicy: false, // Allow inline scripts for AngularJS
		crossOriginEmbedderPolicy: false,
	})
);
app.use(compression());

// View Engine Setup
app.set('port', PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Logging
if (NODE_ENV === 'dev') {
	app.use(morgan('dev'));
} else {
	app.use(morgan('combined'));
}

// Favicon
try {
	app.use(favicon(path.join(__dirname, 'public', 'images', 'icons', 'favicon.ico')));
} catch (err) {
	console.warn('Favicon not found, skipping...');
}

// Body Parsing Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
connectDB();

// Routes
routes(app);

// Error Handling Middleware
app.use((err, req, res, next) => {
	console.error('Error:', err.stack);
	res.status(err.status || 500).json({
		error: {
			message: NODE_ENV === 'dev' ? err.message : 'Internal Server Error',
			status: err.status || 500,
		},
	});
});

// 404 Handler
app.use((req, res) => {
	res.status(404).json({
		error: {
			message: 'Route not found',
			status: 404,
		},
	});
});

// Start Server
server.listen(PORT, () => {
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
	console.log(`🎲 Snakes & Ladders Server`);
	console.log(`📍 Environment: ${NODE_ENV}`);
	console.log(`🚀 Server running on http://localhost:${PORT}`);
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Socket.IO Setup
const io = new SocketIOServer(server, {
	cors: {
		origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
		methods: ['GET', 'POST'],
	},
});

connectSocket(io);

// Graceful Shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM signal received: closing HTTP server');
	server.close(() => {
		console.log('HTTP server closed');
		process.exit(0);
	});
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export { app, server, io };
