'use strict';

var app = angular.module('gameApp', ['gameAppController', 'ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			name: 'home',
			templateUrl: 'partial/title',
			controller: 'gameTitleController'
		})
		.state('about', {
			url: '/about',
			name: 'about',
			templateUrl: 'partial/about',
			controller: 'gameAboutController'
		})
		.state('game-select', {
			name: 'game-select',
			templateUrl: 'partial/game-select',
			controller: 'gameSelectController'
		})
		.state('player-select', {
			name: 'player-select',
			params: {
				gameID: null
			},
			templateUrl: 'partial/player-select',
			controller: 'gamePlayerSelectController'
		})
		.state('play-game', {
			name: 'play-game',
			templateUrl: 'partial/play-game',
			controller: 'gamePlayController'
		});
	$urlRouterProvider.otherwise('/');
}]);