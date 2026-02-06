/**
 * Game Title Component
 * Landing page with game entry and mode selection
 */
'use strict';

angular.module('gameApp').component('gameTitle', {
	controller: [
		'$location',
		function GameTitleController($location) {
			var ctrl = this;

			ctrl.$onInit = function () {
				ctrl.isGameEnter = false;
				if (ctrl.settings) {
					ctrl.settings.isBackEnabled = false;
				}
			};

			ctrl.onGameEnter = function () {
				ctrl.isGameEnter = true;
			};

			ctrl.onGameSelect = function (playMode) {
				$location.path(playMode === 'local' ? '/player-select' : '/game-select');
			};
		},
	],
	bindings: {
		settings: '=',
	},
	template: `
			<div id="game-title">
				<div class="img-box">
					<img src="/images/banners/snakes-and-ladders-banner.png" alt="Snakes and Ladders Banner">
				</div>
				<div class="continue-button">
					<div class="button" ng-show="!$ctrl.isGameEnter" ng-click="$ctrl.onGameEnter()">Enter The Game</div>
					<div class="boxes" ng-show="$ctrl.isGameEnter">
						<div class="box half-box">
							<div class="button" ng-click="$ctrl.onGameSelect('local')">Quick Play</div>
						</div>
						<div class="box half-box">
							<div class="button" ng-click="$ctrl.onGameSelect('global')">Global Battle</div>
						</div>
					</div>
				</div>
			</div>
		`,
});
