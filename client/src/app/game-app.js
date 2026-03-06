/* Creating Angular App Controller for Items and handling some behavioral events */
angular
	.module('gameAppController', [])
	.factory('socket', [
		'$rootScope',
		function ($rootScope) {
			var socket = io.connect();
			return {
				on: function (eventName, callback) {
					socket.on(eventName, function () {
						var args = arguments;
						$rootScope.$apply(function () {
							callback.apply(socket, args);
						});
					});
				},
				emit: function (eventName, data, callback) {
					socket.emit(eventName, data, function () {
						var args = arguments;
						$rootScope.$apply(function () {
							if (callback) {
								callback.apply(socket, args);
							}
						});
					});
				},
			};
		},
	])
	.controller('appController', [
		'$scope',
		'$location',
		function ($scope, $location) {
			$scope.settings = {
				isBackEnabled: false,
				players: [],
				minimumSelectedPlayers: 2,
				maximumSelectedPlayers: 4,
			};
			$scope.gameLayoutBackGround = `bkgrnd-game-${Math.floor(Math.random() * 6 + 1)}`;

			$scope.goBackHome = function () {
				$location.path('/');
			};
		},
	]);
