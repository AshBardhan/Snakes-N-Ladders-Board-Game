module.exports = function (grunt) {
	grunt.initConfig({
		'less': {
			development: {
				src: ['public/less/style.less'],
				dest: 'public/css/style.css'
			}
		},
		concat: {
			options: {
				separator: '\n'
			},
			'js': {
				src: ['public/js/general.js',  'public/js/game.js'],
				dest: 'public/js/interaction.js'
			}
		},
		copy: {
			'css': {
				files: [
					{
						expand: true,
						cwd: 'bower_components/bootstrap/dist/css/',
						src: ['*.css'],
						dest: 'public/css/utils'
					}
				]
			},
			'js': {
				files: [
					{
						expand: true,
						cwd: 'bower_components/bootstrap/dist/js/',
						src: ['*.min.js'],
						dest: 'public/js/utils'
					},
					{
						expand: true,
						cwd: 'bower_components/jquery/dist/',
						src: ['*.min.js'],
						dest: 'public/js/utils'
					},
					{
						expand: true,
						cwd: 'bower_components/jquery-ui/',
						src: ['*.min.js'],
						dest: 'public/js/utils'
					},
					{
						expand: true,
						cwd: 'bower_components/socket.io-client/',
						src: ['*.js'],
						dest: 'public/js/utils'
					}
				]
			}
		},
		uglify: {
			'js': {
				src: ['public/js/interaction.js'],
				dest: 'public/js/interaction.min.js'
			}
		},
		cssmin: {
			'css': {
				src: ['public/css/style.css'],
				dest: 'public/css/style.min.css'
			}
		},
		watch: {
			'js' : {
				files: ['public/js/*.js', '!public/js/interaction*.js'],
				tasks: ['concat:js', 'uglify:js']
			},
			'css' : {
				files: ['public/less/**/*.less'],
				tasks: ['less', 'cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less', 'concat', 'uglify', 'cssmin']);
};