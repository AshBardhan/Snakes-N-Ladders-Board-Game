/* Creating Angular App Controller for Items and handling some behavioral events */
angular.module('gameAppController', [])
	.controller('appController', ['$scope', '$state', function ($scope, $state) {
		$scope.settings = {
			isBackEnabled: false,
			yourGameID: -1,
			maximumSelectedPlayers: 4
		};
		$scope.settings.players = [];
		$scope.settings.selectedPlayerCount = 0;

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

		$http.get(urls.fetchPlayerList).
			success(function (data) {
				$scope.hasPlayersFetched = true;
				$scope.settings.players = data;
			}).
			error(function () {
				$scope.hasPlayersFetched = true;
			});

		$scope.setGamePlayer = function (index) {
			if (!$scope.settings.players[index].selected) {
				if ($scope.settings.selectedPlayerCount < $scope.settings.maximumSelectedPlayers) {
					$scope.settings.players[index].selected = true;
					$scope.settings.selectedPlayerCount += 1;
					if ($scope.settings.selectedPlayerCount >= 2) {
						$scope.canStartGame = true;
					}
				}
			} else {
				$scope.settings.players[index].selected = false;
				$scope.settings.selectedPlayerCount -= 1;
				if ($scope.settings.selectedPlayerCount < 2) {
					$scope.canStartGame = false;
				}
			}
		};

		$scope.startGame = function () {
			$state.go('play-game');
		};
	}])
	.controller('gamePlayController', ['$scope', '$state', '$timeout', '$interval', function ($scope, $state, $timeout, $interval) {
		$scope.settings.isBackEnabled = false;
		$scope.isDiceRolling = false;
		$scope.isPlayerMoving = false;
		$scope.currentPlayer = 0;
		$scope.interactedPlayer = -1;
		$scope.isLadderHit = false;
		$scope.isSnakeBite = false;
		$scope.competitors = [];
		$scope.snakes = [
			[31, 32, 27, 13, 14, 5],
			[73, 74, 75, 64, 54, 45, 34, 35, 36, 37, 21],
			[85, 86, 72, 68, 50],
			[98, 82, 77, 78, 79, 60, 59, 58, 41, 38]
		];
		$scope.ladders = [
			[8, 30],
			[15, 44],
			[17, 63],
			[47, 65],
			[49, 92],
			[62, 80]
		];

		if ($scope.settings.players.length === 0 || $scope.settings.selectedPlayerCount < 2) {
			$state.go('home');
		}

		$scope.setPlayerPosition = function (index) {
			var position = $scope.competitors[index].position,
				positionY = parseInt(position / 10),
				positionX = parseInt(position % 10);

			if (positionY % 2 !== 0) {
				positionX = 9 - positionX;
			}
			return {
				'left': 58 * positionX + 25,
				'bottom': 56 * positionY + 35
			};
		};

		$scope.playerEmotion = function (index) {
			var isInteractedPlayer = ($scope.interactedPlayer === index);
			if ($scope.isSnakeBite) {
				return isInteractedPlayer ? 'sad' : 'happy';
			}
			if ($scope.isLadderHit) {
				return isInteractedPlayer ? 'happy' : 'angry';
			}
			return 'normal';
		};

		$scope.checkObjectHit = function (object, index) {
			var playerPosition = $scope.competitors[index].position;
			for (var i in $scope[object]) {
				if ($scope[object][i][0] == playerPosition) {
					return i;
				}
			}
			return -1;
		};

		$scope.snakeBite = function (index) {
			var snakeIndex =  $scope.checkObjectHit('snakes', index);
			if(snakeIndex !== -1) {
				$scope.interactedPlayer = index;
				$scope.isSnakeBite = true;
				$interval(function (i) {
					$scope.isPlayerMoving = true;
					$scope.competitors[index].position = $scope.snakes[snakeIndex][i + 1];
				}, 300, $scope.snakes[snakeIndex].length - 1).then(function () {
					$scope.isPlayerMoving = false;
					$scope.isSnakeBite = false;
					$scope.interactedPlayer = -1;
				});
			} else {
				$scope.isPlayerMoving = false;
			}
		};

		$scope.ladderHit = function (index) {
			var ladderIndex =  $scope.checkObjectHit('ladders', index);
			if(ladderIndex !== -1) {
				$scope.interactedPlayer = index;
				$scope.isLadderHit = true;
				$timeout(function () {
					$scope.isPlayerMoving = true;
					$scope.competitors[index].position = $scope.ladders[ladderIndex][1];
				}, 300).then(function () {
					$scope.isPlayerMoving = false;
					$scope.isLadderHit = false;
					$scope.interactedPlayer = -1;
				});
			} else {
				$scope.isPlayerMoving = false;
			}
		};

		$scope.movePlayer = function () {
			var index = $scope.currentPlayer,
				source = $scope.competitors[index].position;
			if (source + $scope.dice <= 99) {
				$interval(function () {
					$scope.isPlayerMoving = true;
					++$scope.competitors[index].position;
				}, 300, $scope.dice).then(function () {
						$scope.ladderHit(index);
						$scope.snakeBite(index);
					});
			}
		};

		$scope.rollDice = function () {
			$scope.dice = Math.floor((Math.random() * 6) + 1);
			$scope.previousPlayer = $scope.currentPlayer;
			$scope.isDiceRolling = true;
			$scope.count = -1;
			$timeout(function () {
				$scope.isDiceRolling = false;
				$scope.movePlayer();
			}, 2000).then(function () {
				if ($scope.dice !== 6) {
					$scope.currentPlayer = ($scope.currentPlayer + 1) % $scope.competitors.length;
				}
				$scope.setGamePlayCountdown();
			});
		};

		$scope.findCompetitors = function () {
			$.each($scope.settings.players, function (i, obj) {
				if (obj.selected === true) {
					$scope.competitors.push(obj);
				}
			});
		};

		$scope.setGamePlayCountdown = function() {
			$scope.count = 10;
			(function loop() {
				if ($scope.count > 0) {
					$scope.count -= 1;
					$timeout(loop, 1000);
				} else if ($scope.count === 0) {
					$scope.rollDice();
				} else {
					return false;
				}
			})();
		};

		$scope.findCompetitors();
		$scope.setGamePlayCountdown();
	}]);