module.exports = function (grunt) {
	grunt.initConfig({
		'less': {
			'dev': {
				src: ['public/less/style.less'],
				dest: 'public/css/style.css'
			},
			'prod': {
				options: {
					compress: true
				},
				src: ['public/less/style.less'],
				dest: 'public/css/style.min.css'
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
			'dev-css': {
				files: [
					{
						expand: true,
						cwd: 'bower_components/bootstrap/dist/css/',
						src: ['*.css', '!*.min.css'],
						dest: 'public/css/utils'
					}
				]
			},
			'dev-js': {
				files: [
					{
						flatten: true,
						expand: true,
						cwd: 'bower_components/',
						src: [
							'bootstrap/dist/js/bootstrap.js',
							'jquery/dist/jquery.js',
							'jquery-ui/jquery-ui.js',
							'angular/angular.js',
							'angular-ui/build/angular-ui.js'],
						dest: 'public/js/utils'
					}
				]
			},
			'prod-css': {
				files: [
					{
						expand: true,
						cwd: 'bower_components/bootstrap/dist/css/',
						src: ['*.min.css'],
						dest: 'public/css/utils'
					}
				]
			},
			'prod-js': {
				files: [
					{
						flatten: true,
						expand: true,
						cwd: 'bower_components/',
						src: [
							'bootstrap/dist/js/bootstrap.min.js',
							'jquery/dist/jquery.min.js',
							'jquery-ui/jquery-ui.min.js',
							'angular/angular.min.js',
							'angular-ui/build/angular-ui.min.js'],
						dest: 'public/js/utils'
					}
				]
			}
		},
		clean: {
			'css': ['public/css/'],
			'js': ['public/js/utils/']
		},
		uglify: {
			'js': {
				src: ['public/js/interaction.js'],
				dest: 'public/js/interaction.min.js'
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
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build-dev', ['clean', 'less:dev', 'copy:dev-css', 'copy:dev-js', 'concat']);
	grunt.registerTask('build-prod', ['clean', 'less:prod', 'copy:prod-css', 'copy:prod-js', 'concat', 'uglify']);
};