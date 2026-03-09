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
				$location.path(`/game/${gameId}/setup`);
			};
		},
	],
	bindings: {
		settings: '=',
	},
	template: `
		<div class="game-container">
			<div class="game-section game-section--select">
				<div>
					<h2 class="section-title">New Battle</h2>
					<form class="form-box" ng-submit="$ctrl.onSubmitButton()">
						<div class="input-wrapper">
							<input type="text" ng-model="$ctrl.gameName" name="gameName" placeholder="Enter an unique name"
								maxlength="20" ng-class="{'loading': $ctrl.isGameLoading}" />
							<div class="alert-msg" ng-show="$ctrl.alertMessage.length">
								{{ $ctrl.alertMessage }}
							</div>
						</div>
						<button type="submit" class="button">Create</button>
					</form>	
				</div>
				<div>
					<h2 class="section-title">Battle List</h2>
					<div class="loader-block" ng-show="!$ctrl.hasGamesFetched">
						Loading Battles...
					</div>
					<div class="table-wrapper" ng-show="$ctrl.hasGamesFetched && $ctrl.games.length">
						<table>
							<colgroup>
								<col style="width: 50%">
								<col style="width: 20%">
								<col style="width: 30%">
							</colgroup>
							<tr class="game-row" ng-repeat="game in $ctrl.games">
								<td>{{ game.name }}</td>
								<td>{{ game.playerCount }}/4</td>
								<td>
									<button type="button" class="button button--small" ng-click="$ctrl.joinGame(game._id)">
										Join
									</button>
								</td>
							</tr>
						</table>
					</div>
					<div class="zero-state-block" ng-show="$ctrl.hasGamesFetched && !$ctrl.games.length">
						<h3 class="section-sub-heading">No game currently available.</h3>
						<p>Please create a new game or come back after some time.</p>
					</div>
				</div>
			</div>
		</div>
	`,
});
