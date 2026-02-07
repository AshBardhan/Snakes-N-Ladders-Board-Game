/**
 * API URLs Configuration
 * Centralized endpoint management for the application
 */
const urls = {
	fetchPlayerList: '../api/v1/player/list',
	fetchMemeMessageList: '../api/v1/memeMessage/list',
	fetchGameList: '../api/v1/game/list',
	checkCheatCode: '../api/v1/game/cheat',
	addNewGame: '../api/v1/game/add',
	joinGame: '../api/v1/game/join',
	updateGame: '../api/v1/game/update',
	updatePlayerPlayed: '../api/v1/player/played/update',
	updatePlayerWon: '../api/v1/player/won/update',
	togglePlayerInGame: '../api/v1/gamePlayer/toggle',
	fetchPlayersInGame: '../api/v1/gamePlayer/list',
};

/**
 * UI Messages Configuration
 * User-facing messages and notifications
 */
const msg = {
	enterGameName: 'Please enter at least 3 characters',
	newGameAdded: 'The new game has been added in the list',
	connectionError: 'Unable to connect to server. Please try again.',
	loadingError: 'Failed to load data. Please refresh the page.',
	invalidMove: 'Invalid move. Please try again.',
	gameJoined: 'Successfully joined the game!',
	gameFull: 'This game is already full.',
	playerNotSelected: 'Please select a player before continuing.',
	cheatCodeInvalid: 'Invalid cheat code entered.',
};

/**
 * Utility Functions
 */
const utils = {
	/**
	 * Handle HTTP errors consistently
	 */
	handleError(error, defaultMessage = msg.connectionError) {
		console.error('Error:', error);
		const message = error?.data?.message || error?.message || defaultMessage;
		alert(message);
		return message;
	},

	/**
	 * Validate game name input
	 */
	validateGameName(name) {
		if (!name || name.trim().length < 3) {
			alert(msg.enterGameName);
			return false;
		}
		return true;
	},

	/**
	 * Safe HTTP request wrapper
	 */
	async safeRequest(httpMethod, url, data = null) {
		try {
			const response = data ? await httpMethod(url, data) : await httpMethod(url);
			return response.data;
		} catch (error) {
			this.handleError(error);
			throw error;
		}
	},

	/**
	 * Debounce function for performance optimization
	 */
	debounce(func, wait = 300) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	},
};
