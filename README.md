# Snakes-N-Ladders-Board-Game

A multiplayer web-based **Snakes & Ladders** board game built with Node.js, Express, MongoDB, AngularJS, and Socket.IO.

## Features

- **Two Game Modes**: Quick Play (local) and Global Battle (online multiplayer)
- **2-4 Players** with unique avatars
- **Real-time Multiplayer** using Socket.IO
- **Player Statistics** tracking wins and games played
- **Responsive Design** for mobile and desktop
- **Classic Snake & Ladder Mechanics** with animations

## Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **MongoDB** running locally or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **npm** >= 9.0.0

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Snakes-N-Ladders-Board-Game
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up MongoDB**
   
   **Option A: Local MongoDB**
   - Ensure MongoDB is installed and running on your machine
   - Default connection: `mongodb://localhost:27017/snakes-ladders`
   
   **Option B: MongoDB Atlas**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string
   - Update `MONGODB_URI` in `.env` file

4. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   # At minimum, update:
   # - MONGODB_URI (if not using local MongoDB)
   # - SESSION_SECRET (change to a random string)
   ```

5. **Seed the Database**
   ```bash
   # Populate the database with initial game data (avatars, players, etc.)
   npm run seed
   ```

6. **Build Assets**
   ```bash
   # Compile LESS to CSS and bundle JavaScript
   npm run build
   ```

7. **Start the Application**
   ```bash
   # Development mode with auto-reload and file watching
   npm run dev

   # OR production mode
   npm start
   ```

8. **Access the Game**
   
   Open your browser to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm run dev       # Development: builds assets, starts server with nodemon, watches files
npm start         # Production: starts the server
npm run build     # Build production-ready assets (minified CSS/JS)
npm run seed      # Seed database with initial game data
npm run format    # Format code with Prettier
```

## Database Setup & Seeding

### Initial Seed

After configuring your environment and ensuring MongoDB is running, seed the database with initial game data:

```bash
npm run seed
```

This will populate the database with:
- **8 Players** (6 visible + 2 hidden players unlockable with cheat code)
- **Meme Messages** for different game scenarios (battle, result, winner, loser)

### What Gets Seeded

**Visible Players (6):**
- Smiley (p-1)
- Minion (p-2)
- Troll Kid (p-3)
- Trollmaster (p-4)
- NaMo (p-5)
- RaGa (p-6)

**Hidden Players (2):**
- AshBee (p-7) - Unlock with cheat code: `bardhanmania`
- Ashish (p-8) - Unlock with cheat code: `bardhanmania`

### Admin API Endpoints

While the server is running, you can use these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/seed` | GET | Seed database (skips existing data) |
| `/admin/reset` | GET | Clear ALL data and reseed (use with caution) |
| `/admin/stats` | GET | Get database statistics |

**Example:**
```bash
# Seed via API
curl http://localhost:3000/admin/seed

# Check database stats
curl http://localhost:3000/admin/stats
```

### Verify Database

**Using MongoDB Shell:**
```bash
mongosh mongodb://localhost:27017/snakes-ladders

# Count documents
db.players.countDocuments()        # Should return 8
db.mememessages.countDocuments()   # Should return 4

# View all players
db.players.find().pretty()
```

**Using MongoDB Compass:**
1. Connect to `mongodb://localhost:27017`
2. Select `snakes-ladders` database
3. Browse collections: `players`, `mememessages`, `games`

### Troubleshooting

**Database connection timeout:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if needed
sudo systemctl start mongod
```

**Duplicate key errors:**
```bash
# Reset database (clears all data and reseeds)
curl http://localhost:3000/admin/reset
```

**Connection refused:**
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

## Technology Stack

### Backend
- **Express 4.x** - Web framework
- **MongoDB + Mongoose** - Database
- **Socket.IO 4.x** - Real-time communication
- **Pug** - Template engine

### Frontend
- **AngularJS 1.8.3** - Frontend framework
- **Angular UI Router** - Routing
- **LESS** - CSS preprocessor
- **Vanilla JavaScript (ES6+)** - Game logic

### Build Tools
- **Grunt** - Task runner
- **Uglify** - JavaScript minification
- **LESS Compiler** - CSS compilation

## Development

### Project Structure
```
├── app/                    # Backend application code
│   ├── connections/       # Database and Socket.IO connections
│   ├── controllers/       # Route controllers
│   ├── models/           # Data models
│   ├── schemas/          # Mongoose schemas
│   └── services/         # Business logic
├── public/                # Static assets
│   ├── css/              # Compiled stylesheets
│   ├── js/               # JavaScript files
│   ├── less/             # LESS source files
│   └── images/           # Game assets
├── views/                 # Pug templates
├── server.js             # Application entry point
├── Gruntfile.js          # Build configuration
```

### Building for Production

The build process:
1. Compiles LESS to minified CSS
2. Concatenates JavaScript files
3. Minifies JavaScript with UglifyJS
4. Copies Angular dependencies

Run `npm run build` to create production-ready assets.

## Game Modes

### Quick Play
- Play locally with friends on the same device
- No account required
- Instant start

### Global Battle
- Play online with players worldwide
- Create or join game rooms
- Real-time multiplayer via Socket.IO

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Classic Snakes & Ladders game mechanics
- AngularJS community
- Express.js framework
- Socket.IO real-time engine

---

Made with care for classic board game enthusiasts
