/**
 * Snakes & Ladders AngularJS Application
 * Main application module with routing configuration
 */
'use strict';

const app = angular.module('gameApp', ['gameAppController', 'ui.router']);

// Application Configuration
app.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	function ($stateProvider, $urlRouterProvider, $locationProvider) {
		// Enable HTML5 mode for clean URLs (fallback to hashbang for compatibility)
		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false,
		});

		// Route Definitions
		$stateProvider
			.state('home', {
				url: '/',
				name: 'home',
				templateUrl: 'partial/title',
				controller: 'gameTitleController',
				onEnter: function () {
					console.log('Entering Home State');
				},
			})
			.state('about', {
				url: '/about',
				name: 'about',
				templateUrl: 'partial/about',
				controller: 'gameAboutController',
			})
			.state('game-select', {
				name: 'game-select',
				templateUrl: 'partial/game-select',
				controller: 'gameSelectController',
				onEnter: function () {
					console.log('Entering Game Selection');
				},
			})
			.state('player-select', {
				name: 'player-select',
				params: {
					gameID: null,
				},
				templateUrl: 'partial/player-select',
				controller: 'gamePlayerSelectController',
				onEnter: function () {
					console.log('Entering Player Selection');
				},
			})
			.state('play-game', {
				name: 'play-game',
				templateUrl: 'partial/play-game',
				controller: 'gamePlayController',
				onEnter: function () {
					console.log('Game Started');
				},
			});

		// Default route
		$urlRouterProvider.otherwise('/');
	},
]);

// Global Error Handler
app.run([
	'$rootScope',
	'$state',
	function ($rootScope, $state) {
		// State change error handling
		$rootScope.$on(
			'$stateChangeError',
			function (event, toState, toParams, fromState, fromParams, error) {
				console.error('State change error:', error);
				alert('Navigation error. Redirecting to home.');
				$state.go('home');
			}
		);

		// State change success logging
		$rootScope.$on(
			'$stateChangeSuccess',
			function (event, toState, toParams, fromState, fromParams) {
				console.log('State changed successfully to:', toState.name);
			}
		);
	},
]);
