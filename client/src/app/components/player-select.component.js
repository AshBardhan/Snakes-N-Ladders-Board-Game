/**
 * Player Select Component
 * Select players for the game
 */
'use strict';

angular.module('gameApp').component('playerSelect', {
	controller: [
		'$http',
		'$location',
		'$timeout',
		'$routeParams',
		'$document',
		'socket',
		function PlayerSelectController($http, $location, $timeout, $routeParams, $document, socket) {
			var ctrl = this;

			ctrl.$onInit = function () {
				// Get gameID from route params (0 if not present)
				ctrl.gameID = $routeParams.gameID || 0;

				if (ctrl.settings) {
					ctrl.settings.isBackEnabled = true;
					ctrl.settings.selectedPlayerCount = 0;
				}
				ctrl.canStartGame = false;
				ctrl.timeCountMessage = '';

				ctrl.cheatPosition = 0;
				ctrl.hiddenPlayersUnlocked = false;

				if (!ctrl.settings.players.length) {
					ctrl.hasPlayersFetched = false;
					$http.get(urls.fetchPlayerList).then(
						function (response) {
							ctrl.hasPlayersFetched = true;
							ctrl.settings.players = response.data;
							ctrl.resetPlayers();
						},
						function (error) {
							ctrl.hasPlayersFetched = true;
							console.error('Error fetching players:', error);
						}
					);
				} else {
					ctrl.hasPlayersFetched = true;
					ctrl.resetPlayers();
				}

				if (ctrl.gameID) {
					ctrl.setGameSelectCountdown();
				}

				// Setup cheat code keypress listener
				ctrl.keypressHandler = function (event) {
					if (!ctrl.hiddenPlayersUnlocked) {
						ctrl.handleCheatCode(event.which || event.keyCode);
					}
				};

				$document.on('keypress', ctrl.keypressHandler);
			};

			// Remove keypress listener when component is destroyed
			ctrl.$onDestroy = function () {
				$document.off('keypress', ctrl.keypressHandler);
			};

			ctrl.handleCheatCode = function (charCode) {
				$http
					.post(urls.checkCheatCode, {
						charCode: charCode,
						posn: ctrl.cheatPosition,
					})
					.then(
						function (response) {
							ctrl.cheatPosition = response.data.status;
							if (ctrl.cheatPosition === -1) {
								ctrl.unlockHiddenPlayers();
								ctrl.cheatPosition = 0;
							}
						},
						function (error) {
							console.error('Cheat code check failed:', error);
						}
					);
			};

			ctrl.unlockHiddenPlayers = function () {
				ctrl.settings.players.forEach(function (player) {
					if (player.isHidden) {
						delete player.isHidden;
					}
				});
				ctrl.hiddenPlayersUnlocked = true;
			};

			ctrl.resetPlayers = function () {
				ctrl.settings.players.forEach(function (obj) {
					obj.position = 0;
					obj.selected = false;
					delete obj.isYours;
				});
			};

			ctrl.isNotYourPlayer = function (player) {
				return player.isYours === false && ctrl.gameID;
			};

			ctrl.checkCanStartGame = function () {
				ctrl.canStartGame =
					ctrl.settings.selectedPlayerCount >= ctrl.settings.minimumSelectedPlayers;
			};

			ctrl.setGamePlayer = function (index, selection, isYours) {
				ctrl.count = 10;
				if (selection) {
					if (ctrl.settings.selectedPlayerCount < ctrl.settings.maximumSelectedPlayers) {
						ctrl.settings.players[index].selected = true;
						ctrl.settings.selectedPlayerCount += 1;
						ctrl.settings.players[index].isYours = isYours;
					}
				} else {
					ctrl.settings.players[index].selected = false;
					ctrl.settings.selectedPlayerCount -= 1;
					delete ctrl.settings.players[index].isYours;
				}
				ctrl.checkCanStartGame();
			};

			ctrl.selectGamePlayer = function (index) {
				var selection = !ctrl.settings.players[index].selected;
				ctrl.setGamePlayer(index, selection, true);
				if (ctrl.gameID) {
					socket.emit('selection', {
						index: index,
						gameID: ctrl.gameID,
						selection: selection,
					});
				}
			};

			socket.on('selection', function (data) {
				if (
					data.gameID === ctrl.gameID &&
					ctrl.settings.players[data.index].selected !== data.selection
				) {
					ctrl.setGamePlayer(data.index, data.selection, false);
				}
			});

			ctrl.startGame = function () {
				$location.path(ctrl.gameID ? `/game/${ctrl.gameID}/play` : '/game/play');
			};

			ctrl.getSelectedPlayersCount = function () {
				var count = {
					yours: 0,
					rivals: 0,
					total: 0,
				};
				ctrl.settings.players.forEach(function (obj) {
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

			ctrl.setGameSelectCountdown = function () {
				ctrl.count = 10;
				(function loop() {
					ctrl.timeCountMessage = `Time Left : ${ctrl.count} seconds`;
					if (ctrl.count > 0) {
						ctrl.count -= 1;
						$timeout(loop, 1000);
					} else {
						var playerCount = ctrl.getSelectedPlayersCount();
						if (
							playerCount.yours >= 1 &&
							playerCount.total >= ctrl.settings.minimumSelectedPlayers
						) {
							ctrl.timeCountMessage = 'Launching the game...';
							$timeout(function () {
								ctrl.startGame();
							}, 1000);
						} else {
							ctrl.timeCountMessage = 'Cancelling the game...';
							$timeout(function () {
								ctrl.goBackHome();
							}, 1000);
						}
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
		<div class="game-container">
			<div class="game-section game-section--setup">
				<div>
					<h2 class="section-title">Select Players</h2>
					<h3 class="section-sub-heading" ng-hide="!$ctrl.gameID">{{ $ctrl.timeCountMessage }}</h3>
				</div>
				<div class="loader-block" ng-show="!$ctrl.hasPlayersFetched">
					Loading Players....
				</div>
				<div class="player-select-container" ng-show="$ctrl.hasPlayersFetched && $ctrl.settings.players.length">
					<div class="player-select-item" 
						ng-repeat="player in $ctrl.settings.players" 
						ng-hide="player.isHidden" 
						ng-class="{'selected': player.selected, 'disabled': $ctrl.isNotYourPlayer(player)}">
						<div class="game-player" type="{{player.id}}" ng-click="$ctrl.selectGamePlayer($index)" 
							ng-class="{'selected': player.selected, 'disabled': $ctrl.isNotYourPlayer(player)}">
							<div class="player-who" ng-show="player.selected">
								{{ player.isYours ? 'YOUR ' : 'RIVAL ' }} CHOICE
							</div>
							<div class="player-record">
								<div class="player-record-value">
									{{ player.played > 0 ? (player.won / player.played * 100).toFixed(2) : '0' }}%
								</div>
								<div class="player-record-key">WINS</div>
							</div>
							<div class="player-avatar" type="{{player.id}}"></div>
						</div>
						<div class="player-name" ng-class="'text-color-' + player.id">{{player.name}}</div>
					</div>
				</div>
				<button type="button" class="button" ng-click="$ctrl.startGame()"
					ng-disabled="!$ctrl.canStartGame || $ctrl.gameID"
					ng-show="$ctrl.hasPlayersFetched && $ctrl.settings.players.length">
					Start The Game
				</button>
				<div class="zero-state-block" ng-show="$ctrl.hasPlayersFetched && !$ctrl.settings.players.length">
					<h3 class="section-sub-heading">No players being fetched</h3>
					<p>Please come back after some time.</p>
				</div>
			</div>
		</div>
	`,
});
