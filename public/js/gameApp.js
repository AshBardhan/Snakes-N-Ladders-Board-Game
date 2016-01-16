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
			name: 'mode',
			templateUrl: 'partial/game-mode',
			controller: 'gameModeController'
		})
		.state('select', {
			name: 'select',
			templateUrl: 'partial/game-select',
			controller: 'gameSelectController'
		})
		.state('play', {
			name: 'play',
			templateUrl: 'partial/game-box',
			controller: 'gameBoxController'
		});
	$urlRouterProvider.otherwise('/');
}]);