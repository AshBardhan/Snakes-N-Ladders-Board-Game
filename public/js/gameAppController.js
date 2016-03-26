/* Creating Angular App Controller for Items and handling some behavioral events */
angular.module('gameAppController', [])
	.factory('socket', function ($rootScope) {
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
				})
			}
		};
	})
	.controller('appController', ['$scope', '$state', function ($scope, $state) {
		$scope.settings = {
			isBackEnabled: false,
			yourGameID: undefined,
			minimumSelectedPlayers: 2,
			maximumSelectedPlayers: 4
		};
		$scope.settings.players = [];
		$scope.gameLayoutBackGround = 'bkgrnd-game-' + Math.floor((Math.random() * 6) + 1);

		$scope.goBackHome = function () {
			var fromStateName = $state.current.name,
				toStateName = 'home';

			delete $scope.settings.yourGameID;
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
	.controller('gameSelectController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
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
			var gameID = gameId;
			$state.go('player-select', {
				gameID: gameID
			});
		};

		$scope.searchGameList();
	}])
	.controller('gamePlayerSelectController', ['$scope', '$http', '$state', 'socket', '$timeout', function ($scope, $http, $state, socket, $timeout) {
		$scope.settings.isBackEnabled = true;
		$scope.settings.selectedPlayerCount = 0;
		$scope.settings.yourGameID = $state.params.gameID;
		$scope.canStartGame = false;
		$scope.timeCountMessage = '';

		$scope.resetPlayers = function () {
			$.each($scope.settings.players, function (i, obj) {
				obj.position = 0;
				obj.selected = false;
				delete obj.isYours;
			});
		};

		if (!$scope.settings.players.length) {
			$scope.hasPlayersFetched = false;
			$http.get(urls.fetchPlayerList).
				success(function (data) {
					$scope.hasPlayersFetched = true;
					$scope.settings.players = data;
					$scope.resetPlayers();
				}).
				error(function () {
					$scope.hasPlayersFetched = true;
				});
		} else {
			$scope.hasPlayersFetched = true;
			$scope.resetPlayers();
		}

		$scope.isNotYourPlayer = function (player) {
			return player.isYours === false && $scope.settings.yourGameID;
		};

		$scope.checkCanStartGame = function () {
			$scope.canStartGame = ($scope.settings.selectedPlayerCount >= $scope.settings.minimumSelectedPlayers);
		};

		$scope.setGamePlayer = function (index, selection, isYours) {
			$scope.count = 10;
			if (selection) {
				if ($scope.settings.selectedPlayerCount < $scope.settings.maximumSelectedPlayers) {
					$scope.settings.players[index].selected = true;
					$scope.settings.selectedPlayerCount += 1;
					$scope.settings.players[index].isYours = isYours;
				}
			} else {
				$scope.settings.players[index].selected = false;
				$scope.settings.selectedPlayerCount -= 1;
				delete $scope.settings.players[index].isYours;
			}
			$scope.checkCanStartGame();
		};

		$scope.selectGamePlayer = function (index) {
			var selection = !$scope.settings.players[index].selected;
			$scope.setGamePlayer(index, selection, true);
			if ($scope.settings.yourGameID) {
				socket.emit('selection', {
					index: index,
					gameID: $scope.settings.yourGameID,
					selection: selection
				});
			}
		};

		socket.on('selection', function (data) {
			if (data.gameID === $scope.settings.yourGameID && $scope.settings.players[data.index].selected !== data.selection) {
				$scope.setGamePlayer(data.index, data.selection, false);
			}
		});

		$scope.startGame = function () {
			$state.go('play-game');
		};

		$scope.getSelectedPlayersCount = function () {
			var count = {
				yours: 0,
				rivals: 0,
				total: 0
			};
			$.each($scope.settings.players, function (i, obj) {
				if (obj.selected === true) {
					if (obj.isYours === true) {
						++count.yours;
					} else {
						++count.rivals;
					}
					++count.total;
				}
			});
			return count;
		};

		$scope.setGameSelectCountdown = function () {
			$scope.count = 10;
			(function loop() {
				$scope.timeCountMessage = 'Time Left : ' + $scope.count + ' seconds';
				if ($scope.count > 0) {
					$scope.count -= 1;
					$timeout(loop, 1000);
				} else {
					var playerCount = $scope.getSelectedPlayersCount();
					if (playerCount.yours >= 1 && playerCount.total >= $scope.settings.minimumSelectedPlayers) {
						$scope.timeCountMessage = 'Launching the game...';
						$timeout(function () {
							$scope.startGame();
						}, 1000);
					} else {
						$scope.timeCountMessage = 'Cancelling the game...';
						$timeout(function () {
							$scope.goBackHome();
						}, 1000);
					}
				}
			})();
		};

		if ($scope.settings.yourGameID) {
			$scope.setGameSelectCountdown();
		}
	}])
	.controller('gamePlayController', ['$scope', '$state', '$timeout', '$interval', 'socket', function ($scope, $state, $timeout, $interval, socket) {
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

		if ($scope.settings.players.length === 0 || $scope.settings.selectedPlayerCount < $scope.settings.minimumSelectedPlayers) {
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
			var snakeIndex = $scope.checkObjectHit('snakes', index);
			if (snakeIndex !== -1) {
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
			var ladderIndex = $scope.checkObjectHit('ladders', index);
			if (ladderIndex !== -1) {
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

		$scope.isPlayerWinner = function (index) {
			return $scope.competitors[index].position === 99;
		};

		$scope.showWinner = function (index) {
			$.each($scope.competitors, function (i, obj) {
				obj.message = (obj.isYours ? 'You' : 'Rival') + ' ' + (i === index ? 'Won' : 'Lost');
			});
			$timeout(function () {
				$scope.goBackHome();
			}, 2000);
		};

		$scope.movePlayer = function () {
			var index = $scope.currentPlayer,
				source = $scope.competitors[index].position;
			if (source + $scope.dice <= 99) {
				$interval(function () {
					$scope.isPlayerMoving = true;
					++$scope.competitors[index].position;
					console.log('moving to posn ->' + $scope.competitors[index].position);
				}, 300, $scope.dice).then(function () {
					$scope.ladderHit(index);
					$scope.snakeBite(index);
					console.log('checking winner posn ->' + $scope.competitors[index].position + 'player -> ' + index);
					if ($scope.competitors[index].position === 99) {
						console.log('winner player -> ' + index);
						$scope.showWinner(index);
						$scope.currentPlayer = index;
						$scope.count = -1;
					}
				});
			}
		};

		$scope.switchDicePlayer = function () {
			if ($scope.dice !== 6) {
				$scope.currentPlayer = ($scope.currentPlayer + 1) % $scope.competitors.length;
			}
			console.log('turn to player -> ' + $scope.currentPlayer);
			$scope.setGamePlayCountdown();
		};

		$scope.diceMove = function () {
			$scope.previousPlayer = $scope.currentPlayer;
			$scope.isDiceRolling = true;
			$scope.count = -1;
			$timeout(function () {
				$scope.isDiceRolling = false;
				$scope.movePlayer();
			}, 2000).then(function () {
				$scope.switchDicePlayer();
			});
		};

		$scope.rollDice = function () {
			$scope.dice = Math.floor((Math.random() * 6) + 1);
			$scope.diceMove();
			if ($scope.settings.yourGameID) {
				socket.emit('dice', {
					index: $scope.currentPlayer,
					dice: $scope.dice,
					gameID: $scope.settings.yourGameID
				});
			}
		};

		socket.on('dice', function (data) {
			if (data.gameID === $scope.settings.yourGameID && !$scope.competitors[data.index].isYours) {
				$scope.dice = data.dice;
				console.log('got dice -> ' + $scope.dice);
				$scope.diceMove();
			}
		});

		$scope.findCompetitors = function () {
			$.each($scope.settings.players, function (i, obj) {
				if (obj.selected === true) {
					$scope.competitors.push(obj);
				}
			});
		};

		$scope.initializeCompetitors = function () {
			$.each($scope.competitors, function (i, obj) {
				obj.position = 89;
				obj.message = (obj.isYours ? 'Your' : 'Rival') + ' Turn';
			});
		};

		$scope.setGamePlayCountdown = function () {
			$scope.count = 10;
			(function loop() {
				if ($scope.count > 0) {
					$scope.count -= 1;
					$timeout(loop, 1000);
				} else if ($scope.count === 0) {
					if ($scope.competitors[$scope.currentPlayer].isYours) {
						$scope.rollDice();
					}
				} else {
					return false;
				}
			})();
		};

		$scope.findCompetitors();
		$scope.initializeCompetitors();
		$scope.setGamePlayCountdown();
	}]);