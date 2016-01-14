/* Creating Angular App Controller for Items and handling some behavioral events */
angular.module('gameAppController', [])
	.controller('appController', ['$scope', function ($scope) {
		$scope.intro = 'Welcome to our Page';
	}])
	.controller('gameTitleController', ['$scope', function ($scope) {
		$scope.title = 'game title Testing';
	}])
	.controller('gameAboutController', ['$scope', function ($scope) {
		$scope.title = 'game mode Testing';
	}])
	.controller('gameModeController', ['$scope', function ($scope) {
		$scope.title = 'game mode Testing';
	}])
	.controller('gameSelectController', ['$scope', function ($scope) {
		$scope.title = 'game select Testing';
	}])
	.controller('gameBoxController', ['$scope', function ($scope) {
		$scope.title = 'game box Testing';
	}]);