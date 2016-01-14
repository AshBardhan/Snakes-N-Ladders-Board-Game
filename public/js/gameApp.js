'use strict';

var app = angular.module('gameApp', ['gameAppController', 'ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			name: 'home',
			templateUrl: 'partial/game-title',
			controller: 'gameTitleController'
		})
		.state('about', {
			url: '/about',
			name: 'about',
			templateUrl: 'partial/game-about',
			controller: 'gameAboutController'
		})
		.state('mode', {
			url: '/battle',
			name: 'mode',
			templateUrl: 'partial/game-mode',
			controller: 'gameModeController'
		})
		.state('select', {
			url: '/select-player',
			name: 'select',
			templateUrl: 'partial/game-select',
			controller: 'gameSelectController'
		})
		.state('play', {
			url: '/play-game',
			name: 'play',
			templateUrl: 'partial/game-box',
			controller: 'gameBoxController'
		});
	$urlRouterProvider.otherwise('/');
}]);