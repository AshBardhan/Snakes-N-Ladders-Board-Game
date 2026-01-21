const game = function () {
	this.data = {
		name: null,
		dateCreated: new Date(),
		playerCount: 0,
		isActive: true,
		isOccupied: false,
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

export default function (info) {
	const instance = new game();
	instance.fill(info);
	return instance;
}
