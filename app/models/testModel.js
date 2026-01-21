const image = function () {
	this.data = {
		fileName: null,
		id: null,
		width: null,
		height: null,
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

export default function (info) {
	const instance = new image();
	instance.fill(info);
	return instance;
}
