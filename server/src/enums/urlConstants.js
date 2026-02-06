const API_VERSION = {
	v1: '/api/v1',
	v2: '/api/v2',
	v3: '/api/v3',
};

const urls = {
	ADMIN: {
		SHOW_SCHEMA: '/admin/show-schema-test',
		SAVE_SCHEMA: '/admin/save-schema-test',
		SHOW_MODEL_SCHEMA: '/admin/show-model-schema-test',
		SAVE_MODEL_SCHEMA: '/admin/save-model-schema-test',
		SAVE_PLAYER_MODEL_SCHEMA: '/admin/player/save-model-schema-test',
		SAVE_MEME_MODEL_SCHEMA: '/admin/meme/save-model-schema-test',
		SHOW_MODEL: '/admin/show-model',
	},
	API: {
		FETCH_PLAYER_LIST: API_VERSION.v1 + '/player/list',
		FETCH_MEME_MESSAGE_LIST: API_VERSION.v1 + '/memeMessage/list',
		UPDATE_PLAYER_PLAYED: API_VERSION.v1 + '/player/played/update',
		UPDATE_PLAYER_WON: API_VERSION.v1 + '/player/won/update',
		ADD_NEW_GAME: API_VERSION.v1 + '/game/add',
		UPDATE_GAME: API_VERSION.v1 + '/game/update',
		JOIN_GAME: API_VERSION.v1 + '/game/join',
		FETCH_GAME_LIST: API_VERSION.v1 + '/game/list',
		CHECK_CHEAT_CODE: API_VERSION.v1 + '/game/cheat',
		TOGGLE_PLAYER_IN_GAME: API_VERSION.v1 + '/gamePlayer/toggle',
		FETCH_PLAYER_IN_GAME: API_VERSION.v1 + '/gamePlayer/list',
	},
	WEB: {
		SNAKES_N_LADDERS_GAME: '/',
	},
	TEST: {
		SHOW_SCHEMA: '/test/show-schema-test',
		SAVE_SCHEMA: '/test/save-schema-test',
		SHOW_MODEL_SCHEMA: '/test/show-model-schema-test',
		SAVE_MODEL_SCHEMA: '/test/save-model-schema-test',
		SHOW_MODEL: '/test/show-model',
		GET_LIST: '/test/get',
	},
};

export default urls;
