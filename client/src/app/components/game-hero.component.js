/**
 * Game Hero Component
 * Landing page with game entry and mode selection
 */
'use strict';

angular.module('gameApp').component('gameHero', {
	controller: [
		'$location',
		function GameHeroController($location) {
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
				$location.path(playMode === 'local' ? '/game/setup' : '/game/join');
			};
		},
	],
	bindings: {
		settings: '=',
	},
	template: `
		<div class="game-container">
			<div class="game-section game-section--hero">
				<img class="hero-image" src="/images/banners/snakes-and-ladders-banner.png" alt="Snakes and Ladders Banner">
				<div class="hero-cta" ng-show="!$ctrl.isGameEnter">
					<button type="button" class="button"  ng-click="$ctrl.onGameEnter()">
						Enter The Game
					</button>
					
				</div>
				<div class="hero-cta" ng-show="$ctrl.isGameEnter">
					<button type="button" class="button" ng-click="$ctrl.onGameSelect('local')">
						Play Now
					</button>
					<button type="button" class="button" ng-click="$ctrl.onGameSelect('global')">
						Join Battle
					</button>
				</div>
			</div>
		</div>
	`,
});
