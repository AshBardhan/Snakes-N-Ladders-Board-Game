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
			<div id="game-box">
				<div class="section-title">About the Game</div>
				<div class="section-content">
					A classic Board Game has come alive in your digital screen.
					Make your way to the end of the board by rolling the dice, climbing the ladders and avoiding the snakes.
					Test your luck in "Quick Play" or set up an online "Global Battle" challenging others.
					You can compete with up to 4 players in a single game.
					<br><br>
					For the nerds, this game has been developed in HTML5, CSS3 and JavaScript under NodeJS Express Framework.
					<br><br>
					And for the rest, this game has been created with some "SWAG" and "LULZ".
				</div>
			</div>
		`,
});
