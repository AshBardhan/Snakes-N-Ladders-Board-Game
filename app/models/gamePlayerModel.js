var gamePlayer = function () {
	this.data = {
		gameID: null,
		playerID: null
	};
	this.fill = function (info) {
		for (var prop in this.data) {
			if (this.data[prop] !== 'undefined') {
				this.data[prop] = info[prop];
			}
		}
	};
	this.getInformation = function () {
		return this.data;
	};
};

module.exports = function (info) {
	var instance = new gamePlayer();
	instance.fill(info);
	return instance;
};