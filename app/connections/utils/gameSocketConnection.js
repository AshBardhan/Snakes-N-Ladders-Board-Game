const connectSocket = io => {
	io.on('connection', function (socket) {
		socket.on('disconnect', function () {});
		socket.on('selection', function (dataObj) {
			io.emit('selection', dataObj);
		});
		socket.on('dice', function (dataObj) {
			io.emit('dice', dataObj);
		});
		socket.on('playerWin', function (dataObj) {
			io.emit('playerWin', dataObj);
		});
		socket.on('unlockPlayers', function (dataObj) {
			io.emit('unlockPlayers', dataObj);
		});
		socket.on('newGame', function (dataObj) {
			io.emit('newGame', dataObj);
		});
		socket.on('selectCountdown', function (dataObj) {
			io.emit('selectCountdown', dataObj);
		});
		socket.on('removeSelectedRival', function (dataObj) {
			io.emit('removeSelectedRival', dataObj);
		});
		socket.on('removePlayRival', function (dataObj) {
			io.emit('removePlayRival', dataObj);
		});
	});
};

export default connectSocket;
