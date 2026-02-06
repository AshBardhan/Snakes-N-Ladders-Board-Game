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
		'socket',
		function PlayerSelectController($http, $location, $timeout, socket) {
			var ctrl = this;

			ctrl.$onInit = function () {
				if (ctrl.settings) {
					ctrl.settings.isBackEnabled = true;
					ctrl.settings.selectedPlayerCount = 0;
					ctrl.settings.yourGameID = ctrl.gameID;
				}
				ctrl.canStartGame = false;
				ctrl.timeCountMessage = '';

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

				if (ctrl.settings.yourGameID) {
					ctrl.setGameSelectCountdown();
				}
			};

			ctrl.resetPlayers = function () {
				ctrl.settings.players.forEach(function (obj) {
					obj.position = 0;
					obj.selected = false;
					delete obj.isYours;
				});
			};

			ctrl.isNotYourPlayer = function (player) {
				return player.isYours === false && ctrl.settings.yourGameID;
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
				if (ctrl.settings.yourGameID) {
					socket.emit('selection', {
						index: index,
						gameID: ctrl.settings.yourGameID,
						selection: selection,
					});
				}
			};

			socket.on('selection', function (data) {
				if (
					data.gameID === ctrl.settings.yourGameID &&
					ctrl.settings.players[data.index].selected !== data.selection
				) {
					ctrl.setGamePlayer(data.index, data.selection, false);
				}
			});

			ctrl.startGame = function () {
				$location.path('/play-game');
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
					ctrl.timeCountMessage = 'Time Left : ' + ctrl.count + ' seconds';
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
								if (ctrl.goBackHome) {
									ctrl.goBackHome();
								}
							}, 1000);
						}
					}
				})();
			};
		},
	],
	bindings: {
		settings: '=',
		gameID: '<',
		goBackHome: '&',
	},
	template: `
			<div id="player-select">
				<div class="section-title">
					Select Players
					<div class="time-count" ng-hide="!$ctrl.settings.yourGameID">{{ $ctrl.timeCountMessage }}</div>
				</div>
				<div ng-show="!$ctrl.hasPlayersFetched">Loading Players....</div>
				<div id="playerList" ng-show="$ctrl.hasPlayersFetched && $ctrl.settings.players.length">
					<div class="player-select-box" 
						ng-repeat="player in $ctrl.settings.players" 
						ng-click="$ctrl.selectGamePlayer($index)" 
						ng-hide="player.isHidden" 
						ng-class="{'selected': player.selected, 'disabled': $ctrl.isNotYourPlayer(player)}">
						<div class="game-player" type="{{player.id}}">
							<div class="player-who" ng-show="player.selected">{{ player.isYours ? 'YOUR ' : 'RIVAL ' }} CHOICE</div>
							<div class="player-record">
								<div class="rec">{{ player.played > 0 ? (player.won / player.played * 100).toFixed(2) : '0.00' }} %</div>
								<div class="title">WINS</div>
							</div>
							<div class="player-avatar"></div>
						</div>
					<div class="player-name" ng-class="'text-color-' + player.id">{{player.name}}</div>
					</div>
					<div class="continue-button" ng-show="$ctrl.canStartGame && !$ctrl.settings.yourGameID" ng-click="$ctrl.startGame()">
						<div class="button">Start The Game</div>
					</div>
				</div>
				<div id="noPlayerList" ng-show="$ctrl.hasPlayersFetched && !$ctrl.settings.players.length">
					No players being fetched. Please come back after some time.
				</div>
			</div>
		`,
});
