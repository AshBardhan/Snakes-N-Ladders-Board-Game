/* Creating Angular App Controller for Items and handling some behavioral events */
angular.module('gameAppController', [])
	.controller('appController', ['$scope', '$state', function ($scope, $state) {
		$scope.settings = {
			isBackEnabled: false,
			yourGameID: -1,
			maximumSelectedPlayers: 4
		};
		$scope.gameLayoutBackGround = 'bkgrnd-game-' + Math.floor((Math.random() * 6) + 1);

		$scope.onBackClick = function () {
			var fromStateName = $state.current.name,
				toStateName = 'home';

			$state.go('home');
		};
	}])
	.controller('gameTitleController', ['$scope', '$state', function ($scope, $state) {
		$scope.isGameEnter = false;
		$scope.settings.isBackEnabled = false;

		$scope.onGameEnter = function () {
			$scope.isGameEnter = true;
		};

		$scope.onGameSelect = function (playMode) {
			$state.go(playMode === 'local' ? 'player-select' : 'game-select');
		};
	}])
	.controller('gameAboutController', ['$scope', function ($scope) {
		$scope.settings.isBackEnabled = true;
	}])
	.controller('gameSelectController', ['$scope', '$http', function ($scope, $http) {
		$scope.settings.isBackEnabled = true;
		$scope.hasGamesFetched = false;
		$scope.isGameLoading = false;
		$scope.gameName = '';
		$scope.alertMessage = '';
		$scope.games = [];

		$scope.searchGameList = function () {
			$http.get(urls.fetchGameList).
				success(function (data) {
					$scope.games = data;
				}).
				finally(function () {
					$scope.hasGamesFetched = true;
				});
		};

		$scope.onSubmitButton = function () {
			var name = $scope.gameName;
			if (name.length > 3) {
				$scope.isGameLoading = true;
				$http.post(urls.addNewGame, {name: name}).
					success(function (data) {
						$scope.hasGamesFetched = true;
						if (data.status === 1) {
							$scope.alertMessage = data.errMsg;
						} else {
							$scope.alertMessage = msg.newGameAdded;
							$scope.searchGameList();
							$scope.gameName = '';
						}
					}).
					error(function () {
						$scope.hasGamesFetched = true;
					}).
					finally(function () {
						$scope.isGameLoading = false;
					});
			} else {
				$scope.alertMessage = msg.enterGameName;
			}
		};

		$scope.joinGame = function (gameId) {

		};

		$scope.searchGameList();
	}])
	.controller('gamePlayerSelectController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
		$scope.settings.isBackEnabled = true;
		$scope.hasPlayersFetched = false;
		$scope.canStartGame = false;
		$scope.selectedPlayerCount = 0;
		$scope.players = [];

		$http.get(urls.fetchPlayerList).
			success(function (data) {
				$scope.hasPlayersFetched = true;
				$scope.players = data;
			}).
			error(function () {
				$scope.hasPlayersFetched = true;
			});

		$scope.setGamePlayer = function (index) {
			if (!$scope.players[index].selected) {
				if ($scope.selectedPlayerCount < $scope.settings.maximumSelectedPlayers) {
					$scope.players[index].selected = true;
					$scope.selectedPlayerCount += 1;
					if ($scope.selectedPlayerCount >= 2) {
						$scope.canStartGame = true;
					}
				}
			} else {
				$scope.players[index].selected = false;
				$scope.selectedPlayerCount -= 1;
				if ($scope.selectedPlayerCount < 2) {
					$scope.canStartGame = false;
				}
			}
		};

		$scope.startGame = function () {
			$state.go('play-game');
		};
	}])
	.controller('gamePlayController', ['$scope', function ($scope) {
		$scope.settings.isBackEnabled = false;
	}]);