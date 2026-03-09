/**
 * Game About Component
 * Information about the game
 */
'use strict';

angular.module('gameApp').component('gameAbout', {
	controller: [
		function GameAboutController() {
			var ctrl = this;

			ctrl.$onInit = function () {
				if (ctrl.settings) {
					ctrl.settings.isBackEnabled = true;
				}
			};
		},
	],
	bindings: {
		settings: '=',
	},
	template: `
		<div class="game-container">
			<div class="game-section game-section--about">
				<h2 class="section-title">About Game</h2>
				<div class="text-center">
					<p>
						Experience the timeless thrill of Snakes and Ladders brought to life on your digital screen. 
						Roll the dice, climb ladders to advance quickly, and dodge snakes that send you sliding back down.
					</p>
					<p>	
						Whether you're playing solo or competing against friends and rivals in a Battle, 
						each game is a fresh test of luck and strategy with support for up to 4 players.
					</p>
					<p>
						Ready to race to the finish? May the dice be ever in your favor!
					</p>
				</div>
			</div>
		</div>
	`,
});
