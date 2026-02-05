/**
 * Snakes & Ladders AngularJS Application
 * Main application module with routing configuration
 */
'use strict';

const app = angular.module('gameApp', ['gameAppController', 'ngRoute']);

// Application Configuration
app.config([
	'$routeProvider',
	'$locationProvider',
	function ($routeProvider, $locationProvider) {
		// Enable HTML5 mode for clean URLs (fallback to hashbang for compatibility)
		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false,
		});

		// Route Definitions
		$routeProvider
			.when('/', {
				templateUrl: 'partial/title',
				controller: 'gameTitleController',
			})
			.when('/about', {
				templateUrl: 'partial/about',
				controller: 'gameAboutController',
			})
			.when('/game-select', {
				templateUrl: 'partial/game-select',
				controller: 'gameSelectController',
			})
			.when('/player-select', {
				templateUrl: 'partial/player-select',
				controller: 'gamePlayerSelectController',
			})
			.when('/player-select/:gameID', {
				templateUrl: 'partial/player-select',
				controller: 'gamePlayerSelectController',
			})
			.when('/play-game', {
				templateUrl: 'partial/play-game',
				controller: 'gamePlayController',
			})
			.otherwise({
				redirectTo: '/',
			});
	},
]);

// Global Error Handler
app.run([
	'$rootScope',
	'$location',
	function ($rootScope, $location) {
		// Route change error handling
		$rootScope.$on(
			'$routeChangeError',
			function (event, current, previous, rejection) {
				console.error('Route change error:', rejection);
				alert('Navigation error. Redirecting to home.');
				$location.path('/');
			}
		);

		// Route change success logging
		$rootScope.$on(
			'$routeChangeSuccess',
			function (event, current, previous) {
				console.log('Route changed successfully to:', $location.path());
			}
		);
	},
]);
