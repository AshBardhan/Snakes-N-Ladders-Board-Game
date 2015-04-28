var memeMessage = function () {
	this.data = {
		type: null,
		playerCount: null
	};
	this.fill = function (info) {
		for (var prop in this.data) {
			if (typeof this.data[prop] !== 'undefined' && typeof info[prop] !== 'undefined') {
				this.data[prop] = info[prop];
			}
		}
	};
	this.getInformation = function () {
		return this.data;
	};
};

module.exports = function (info) {
	var instance = new memeMessage();
	instance.fill(info);
	return instance;
};