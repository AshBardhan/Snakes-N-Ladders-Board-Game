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
				template: '<game-hero settings="settings"></game-hero>',
			})
			.when('/about', {
				template: '<game-about settings="settings"></game-about>',
			})
			.when('/game/join', {
				template: '<game-select settings="settings"></game-select>',
			})
			.when('/game/:gameID?/setup', {
				template: '<player-select settings="settings" go-back-home="goBackHome()"></player-select>',
			})
			.when('/game/:gameID?/play', {
				template: '<play-game settings="settings" go-back-home="goBackHome()"></play-game>',
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
		$rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
			console.error('Route change error:', rejection);
			alert('Navigation error. Redirecting to home.');
			$location.path('/');
		});

		// Route change success logging
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			console.log('Route changed successfully to:', $location.path());
		});
	},
]);
