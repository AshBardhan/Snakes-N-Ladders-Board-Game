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
			<div class="game-section">
				<h2 class="section-title">About the Game</h2>
				<div class="text-center">
					<p>
						A classic Board Game has come alive in your digital screen.
						Make your way to the end of the board by rolling the dice, climbing the ladders and avoiding the snakes.
						Test your luck in "Quick Play" or set up an online "Global Battle" challenging others.
						You can compete with up to 4 players in a single game.
					</p>
					<p>
						For the nerds, this game has been developed in MEAN stack.
					</p>
					<p>
						And for the rest, this game has been created with some "SWAG" and "LULZ".
					</p>
					<p>
						Enjoy the game and may the dice be ever in your favor!
					</p>
				</div>
			</div>
		</div>
	`,
});
