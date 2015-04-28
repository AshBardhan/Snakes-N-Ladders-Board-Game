var image = function () {
	this.data = {
		fileName: null,
		id: null,
		fileType: null,
		url: null,
		securedUrl: null,
		width: null,
		height: null
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
	var instance = new image();
	instance.fill(info);
	return instance;
};