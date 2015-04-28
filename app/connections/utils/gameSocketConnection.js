module.exports = function (io) {
	io.on('connection', function (socket) {
		socket.on('disconnect', function () {
		});
		socket.on('selection', function (msg) {
			io.emit('selection', msg);
		});
		socket.on('dice', function (msg) {
			io.emit('dice', msg);
		});
		socket.on('playerWin', function (msg) {
			io.emit('playerWin', msg);
		});
		socket.on('unlockPlayers', function (msg) {
			io.emit('unlockPlayers', msg);
		});
		socket.on('newGame', function (msg) {
			io.emit('newGame', msg);
		});
		socket.on('selectCountdown', function (msg) {
			io.emit('selectCountdown', msg);
		});
		socket.on('removeSelectedRival', function (msg) {
			io.emit('removeSelectedRival', msg);
		});
		socket.on('removePlayRival', function (msg) {
			io.emit('removePlayRival', msg);
		});
	});
}