/**
 * Play Game Component
 * Main game board and gameplay logic
 */
'use strict';

angular.module('gameApp').component('playGame', {
	controller: [
		'$location',
		'$timeout',
		'$interval',
		'socket',
		function PlayGameController($location, $timeout, $interval, socket) {
			var ctrl = this;

			ctrl.$onInit = function () {
				if (ctrl.settings) {
					ctrl.settings.isBackEnabled = false;
				}

				ctrl.isDiceRolling = false;
				ctrl.isPlayerMoving = false;
				ctrl.currentPlayer = 0;
				ctrl.interactedPlayer = -1;
				ctrl.isLadderHit = false;
				ctrl.isSnakeBite = false;
				ctrl.competitors = [];
				ctrl.snakes = [
					[31, 32, 27, 13, 14, 5],
					[73, 74, 75, 64, 54, 45, 34, 35, 36, 37, 21],
					[85, 86, 72, 68, 50],
					[98, 82, 77, 78, 79, 60, 59, 58, 41, 38],
				];
				ctrl.ladders = [
					[8, 30],
					[15, 44],
					[17, 63],
					[47, 65],
					[49, 92],
					[62, 80],
				];

				if (
					ctrl.settings.players.length === 0 ||
					ctrl.settings.selectedPlayerCount < ctrl.settings.minimumSelectedPlayers
				) {
					$location.path('/');
					return;
				}

				ctrl.findCompetitors();
				ctrl.initializeCompetitors();
				ctrl.setGamePlayCountdown();

				socket.on('dice', function (data) {
					if (data.gameID === ctrl.settings.yourGameID && !ctrl.competitors[data.index].isYours) {
						ctrl.dice = data.dice;
						console.log('got dice -> ' + ctrl.dice);
						ctrl.diceMove();
					}
				});
			};

			ctrl.setPlayerPosition = function (index) {
				var position = ctrl.competitors[index].position,
					positionY = parseInt(position / 10),
					positionX = parseInt(position % 10);

				if (positionY % 2 !== 0) {
					positionX = 9 - positionX;
				}
				return {
					left: 58 * positionX + 25 + 'px',
					bottom: 56 * positionY + 35 + 'px',
				};
			};

			ctrl.playerEmotion = function (index) {
				var isInteractedPlayer = ctrl.interactedPlayer === index;
				if (ctrl.isSnakeBite) {
					return isInteractedPlayer ? 'sad' : 'happy';
				}
				if (ctrl.isLadderHit) {
					return isInteractedPlayer ? 'happy' : 'angry';
				}
				return 'normal';
			};

			ctrl.checkObjectHit = function (object, index) {
				var playerPosition = ctrl.competitors[index].position;
				for (var i in ctrl[object]) {
					if (ctrl[object][i][0] == playerPosition) {
						return i;
					}
				}
				return -1;
			};

			ctrl.snakeBite = function (index) {
				var snakeIndex = ctrl.checkObjectHit('snakes', index);
				if (snakeIndex !== -1) {
					ctrl.interactedPlayer = index;
					ctrl.isSnakeBite = true;
					var i = 0;
					$interval(
						function () {
							ctrl.isPlayerMoving = true;
							i++;
							ctrl.competitors[index].position = ctrl.snakes[snakeIndex][i];
						},
						300,
						ctrl.snakes[snakeIndex].length - 1
					).then(function () {
						ctrl.isPlayerMoving = false;
						ctrl.isSnakeBite = false;
						ctrl.interactedPlayer = -1;
					});
				} else {
					ctrl.isPlayerMoving = false;
				}
			};

			ctrl.ladderHit = function (index) {
				var ladderIndex = ctrl.checkObjectHit('ladders', index);
				if (ladderIndex !== -1) {
					ctrl.interactedPlayer = index;
					ctrl.isLadderHit = true;
					$timeout(function () {
						ctrl.isPlayerMoving = true;
						ctrl.competitors[index].position = ctrl.ladders[ladderIndex][1];
					}, 300).then(function () {
						ctrl.isPlayerMoving = false;
						ctrl.isLadderHit = false;
						ctrl.interactedPlayer = -1;
					});
				} else {
					ctrl.isPlayerMoving = false;
				}
			};

			ctrl.isPlayerWinner = function (index) {
				return ctrl.competitors[index].position === 99;
			};

			ctrl.showWinner = function (index) {
				ctrl.competitors.forEach(function (obj, i) {
					obj.message = (obj.isYours ? 'You' : 'Rival') + ' ' + (i === index ? 'Won' : 'Lost');
				});
				$timeout(function () {
					if (ctrl.goBackHome) {
						ctrl.goBackHome();
					}
				}, 2000);
			};

			ctrl.movePlayer = function () {
				var index = ctrl.currentPlayer,
					source = ctrl.competitors[index].position;
				console.log('player posn -> ' + source + ' dice -> ' + ctrl.dice);
				if (source + ctrl.dice <= 99) {
					$interval(
						function () {
							ctrl.isPlayerMoving = true;
							++ctrl.competitors[index].position;
							console.log('moving to posn ->' + ctrl.competitors[index].position);
						},
						300,
						ctrl.dice
					).then(function () {
						ctrl.ladderHit(index);
						ctrl.snakeBite(index);
						console.log(
							'checking winner posn ->' + ctrl.competitors[index].position + 'player -> ' + index
						);
						if (ctrl.competitors[index].position === 99) {
							console.log('winner player -> ' + index);
							ctrl.showWinner(index);
							ctrl.currentPlayer = index;
							ctrl.count = -1;
						}
					});
				}
			};

			ctrl.switchDicePlayer = function () {
				if (ctrl.dice !== 6) {
					ctrl.currentPlayer = (ctrl.currentPlayer + 1) % ctrl.competitors.length;
				}
				console.log('turn to player -> ' + ctrl.currentPlayer);
				ctrl.setGamePlayCountdown();
			};

			ctrl.diceMove = function () {
				ctrl.previousPlayer = ctrl.currentPlayer;
				ctrl.isDiceRolling = true;
				ctrl.count = -1;
				$timeout(function () {
					ctrl.isDiceRolling = false;
					ctrl.movePlayer();
				}, 2000).then(function () {
					ctrl.switchDicePlayer();
				});
			};

			ctrl.rollDice = function () {
				ctrl.dice = Math.floor(Math.random() * 6 + 1);
				ctrl.diceMove();
				if (ctrl.settings.yourGameID) {
					socket.emit('dice', {
						index: ctrl.currentPlayer,
						dice: ctrl.dice,
						gameID: ctrl.settings.yourGameID,
					});
				}
			};

			ctrl.findCompetitors = function () {
				ctrl.settings.players.forEach(function (obj) {
					if (obj.selected === true) {
						ctrl.competitors.push(obj);
					}
				});
			};

			ctrl.initializeCompetitors = function () {
				ctrl.competitors.forEach(function (obj, i) {
					obj.position = 0;
					obj.message = (obj.isYours ? 'Your' : 'Rival') + ' Turn';
				});
			};

			ctrl.setGamePlayCountdown = function () {
				ctrl.count = 10;
				(function loop() {
					if (ctrl.count > 0) {
						ctrl.count -= 1;
						$timeout(loop, 1000);
					} else if (ctrl.count === 0) {
						if (ctrl.competitors[ctrl.currentPlayer].isYours) {
							ctrl.rollDice();
						}
					} else {
						return false;
					}
				})();
			};
		},
	],
	bindings: {
		settings: '=',
		goBackHome: '&',
	},
	template: `
			<div id="game-box">
				<div class="boxes">
					<div class="box half-box">
						<div class="dice-box">
							<div class="dice-show" ng-class="{'animate': $ctrl.isDiceRolling}">
							<div class="message" ng-hide="$ctrl.isDiceRolling" ng-class="'bkgrnd-' + $ctrl.competitors[$ctrl.previousPlayer].id">{{ $ctrl.dice || '' }}</div>
							</div>
							<div class="dice-button" ng-click="$ctrl.isPlayerMoving || $ctrl.isDiceRolling || $ctrl.rollDice()" ng-disabled="$ctrl.isPlayerMoving || $ctrl.isDiceRolling" ng-class="{'disabled': !$ctrl.competitors[$ctrl.currentPlayer].isYours || $ctrl.isPlayerWinner($ctrl.currentPlayer)}">
								<div class="button">Roll Dice</div>
							</div>
						</div>
						<div class="mini-score-box">
						<div class="mini-score-board" ng-repeat="player in $ctrl.competitors" ng-class="'bkgrnd-' + player.id" type="{{ player.id }}">
							{{ player.name }}
							<div class="game-player" type="{{ player.id }}">
								<div class="player-avatar" type="{{ $ctrl.playerEmotion($index) }}"></div>
							</div>
							<div class="player-message" ng-class="'text-color-' + player.id" ng-show="$ctrl.currentPlayer === $index || $ctrl.isPlayerWinner($ctrl.currentPlayer)">{{ player.message }}</div>
							</div>
						</div>
						<div class="game-board">
							<img src="../images/boards/snakes-and-ladders-board.jpg">
							<div class="game-player" ng-repeat="player in $ctrl.competitors" type="{{ player.id }}" ng-style="$ctrl.setPlayerPosition($index)">
								<div class="player-avatar" type="{{ $ctrl.playerEmotion($index) }}"></div>
							</div>
						</div>
					</div>
					<div class="game-score box half-box">
						<div class="dice-box">
							<div class="dice-show" ng-class="{'animate': $ctrl.isDiceRolling}">
							<div class="message" ng-hide="$ctrl.isDiceRolling" ng-class="'bkgrnd-' + $ctrl.competitors[$ctrl.previousPlayer].id">{{ $ctrl.dice || '' }}</div>
							</div>
							<div class="dice-button" ng-click="$ctrl.isPlayerMoving || $ctrl.isDiceRolling || $ctrl.rollDice()" ng-disabled="$ctrl.isPlayerMoving || $ctrl.isDiceRolling" ng-class="{'disabled': !$ctrl.competitors[$ctrl.currentPlayer].isYours || $ctrl.isPlayerWinner($ctrl.currentPlayer)}">
								<div class="button">Roll Dice</div>
							</div>
						</div>
						<div class="score-box">
						<div class="score-board" ng-repeat="player in $ctrl.competitors" ng-class="'bkgrnd-' + player.id" type="{{ player.id }}">
							{{ player.name }}
							<div class="game-player" type="{{ player.id }}">
								<div class="player-avatar" type="{{ $ctrl.playerEmotion($index) }}"></div>
							</div>
							<div class="player-message" ng-class="'text-color-' + player.id" ng-show="$ctrl.currentPlayer === $index || $ctrl.isPlayerWinner($ctrl.currentPlayer)">{{ player.message }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`,
});
