/**
 * Game Select Component
 * Create or join multiplayer battles
 */
'use strict';

angular.module('gameApp').component('gameSelect', {
	controller: [
		'$http',
		'$location',
		function GameSelectController($http, $location) {
			var ctrl = this;

			ctrl.$onInit = function () {
				if (ctrl.settings) {
					ctrl.settings.isBackEnabled = true;
				}
				ctrl.hasGamesFetched = false;
				ctrl.isGameLoading = false;
				ctrl.gameName = '';
				ctrl.alertMessage = '';
				ctrl.games = [];

				ctrl.searchGameList();
			};

			ctrl.searchGameList = function () {
				$http
					.get(urls.fetchGameList)
					.then(function (response) {
						ctrl.games = response.data;
					})
					.finally(function () {
						ctrl.hasGamesFetched = true;
					});
			};

			ctrl.onSubmitButton = function () {
				var name = ctrl.gameName;
				if (name.length > 3) {
					ctrl.isGameLoading = true;
					$http
						.post(urls.addNewGame, { name: name })
						.then(
							function (response) {
								ctrl.hasGamesFetched = true;
								var data = response.data;
								if (data.status === 1) {
									ctrl.alertMessage = data.errMsg;
								} else {
									ctrl.alertMessage = msg.newGameAdded;
									ctrl.searchGameList();
									ctrl.gameName = '';
								}
							},
							function (error) {
								ctrl.hasGamesFetched = true;
								console.error('Error adding game:', error);
							}
						)
						.finally(function () {
							ctrl.isGameLoading = false;
						});
				} else {
					ctrl.alertMessage = msg.enterGameName;
				}
			};

			ctrl.joinGame = function (gameId) {
				$location.path('/player-select/' + gameId);
			};
		},
	],
	bindings: {
		settings: '=',
	},
	template: `
			<div id="game-select">
				<div class="game-select-box">
					<div class="section-title">Create New Battle</div>
					<div class="create-game-box">
						<input type="text" ng-model="$ctrl.gameName" name="gameName" placeholder="Enter an unique name" maxlength="20" ng-class="{'loading': $ctrl.isGameLoading}">
						<div class="continue-button display-inline">
							<div class="button" ng-click="$ctrl.onSubmitButton()">Submit</div>
						</div>
						<div class="alert-msg" ng-show="$ctrl.alertMessage.length">{{ $ctrl.alertMessage }}</div>
					</div>
				</div>
				<div class="game-select-box">
					<div class="section-title">Join Other Battle</div>
					<div class="join-game-box">
						<div class="continue-button text-right"></div>
						<table id="gameList" ng-show="$ctrl.hasGamesFetched && $ctrl.games.length">
							<tr class="game-row" ng-repeat="game in $ctrl.games">
								<td>{{ game.name }}</td>
								<td>{{ game.playerCount }}/4 playing</td>
								<td>
									<div class="continue-button">
										<div class="button" ng-click="$ctrl.joinGame(game._id)">Join</div>
									</div>
								</td>
							</tr>
						</table>
						<div id="noGameList" ng-show="!$ctrl.hasGamesFetched || !$ctrl.games.length">
							No game currently available. Please create a new game or come back after some time.
						</div>
					</div>
				</div>
			</div>
		`,
});
