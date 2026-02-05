/**
 * Grunt Build Configuration
 * Optimized build process for Snakes & Ladders game
 */
module.exports = function (grunt) {
	
	// Time how long tasks take
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// LESS Compilation
		less: {
			dev: {
				options: {
					sourceMap: true,
					sourceMapFilename: 'public/css/style.css.map',
					sourceMapURL: 'style.css.map'
				},
				src: ['public/less/style.less'],
				dest: 'public/css/style.css'
			},
			prod: {
				options: {
					compress: true,
					cleancss: true,
					optimization: 2
				},
				src: ['public/less/style.less'],
				dest: 'public/css/style.min.css'
			}
		},

		// JavaScript Concatenation
		concat: {
			options: {
				separator: '\n\n',
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */\n',
				stripBanners: true
			},
			js: {
				src: [
					'public/js/gameApp.js',
					'public/js/gameAppController.js'
				],
				dest: 'public/js/interaction.js'
			}
		},

		// Copy Angular Dependencies
		copy: {
			'dev-js': {
				files: [
					{
						flatten: true,
						expand: true,
						cwd: 'node_modules/',
						src: [
							'angular/angular.js',
							'angular-route/angular-route.js'
						],
						dest: 'public/js/utils'
					}
				]
			},
			'prod-js': {
				files: [
					{
						flatten: true,
						expand: true,
						cwd: 'node_modules/',
						src: [
							'angular/angular.min.js',
							'angular-route/angular-route.min.js'
						],
						dest: 'public/js/utils'
					}
				]
			}
		},

		// Clean Build Artifacts
		clean: {
			css: ['public/css/'],
			js: ['public/js/utils/', 'public/js/interaction*.js'],
			all: ['public/css/', 'public/js/utils/', 'public/js/interaction*.js']
		},

		// JavaScript Minification
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				compress: {
					drop_console: true,
					dead_code: true,
					unused: true
				},
				mangle: true
			},
			js: {
				src: ['public/js/interaction.js'],
				dest: 'public/js/interaction.min.js'
			}
		},

		// Watch for Changes
		watch: {
			options: {
				livereload: true,
				spawn: false
			},
			js: {
				files: ['public/js/*.js', '!public/js/interaction*.js'],
				tasks: ['concat:js', 'uglify:js'],
				options: {
					event: ['changed', 'added']
				}
			},
			css: {
				files: ['public/less/**/*.less'],
				tasks: ['less:dev'],
				options: {
					event: ['changed', 'added']
				}
			}
		}
	});

	// Load npm tasks
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Custom Tasks
	grunt.registerTask('default', ['build-dev']);
	grunt.registerTask('build-dev', ['clean:all', 'less:dev', 'copy:dev-js', 'concat']);
	grunt.registerTask('build-prod', ['clean:all', 'less:prod', 'copy:prod-js', 'concat', 'uglify']);
	
	// Helper Tasks
	grunt.registerTask('styles', ['less:dev']);
	grunt.registerTask('scripts', ['concat:js', 'uglify:js']);
	
	// Log task completion
	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};