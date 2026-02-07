/**
 * Grunt Build Configuration
 * Optimized build process for Snakes & Ladders game
 */
module.exports = function (grunt) {
	
	// Time how long tasks take
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('../package.json'),

		// LESS Compilation
		less: {
			dev: {
				options: {
					sourceMap: true,
					sourceMapFilename: 'dist/css/style.css.map',
					sourceMapURL: 'style.css.map'
				},
				src: ['src/styles/less/style.less'],
				dest: 'dist/css/style.css'
			},
			prod: {
				options: {
					compress: true,
					cleancss: true,
					optimization: 2
				},
				src: ['src/styles/less/style.less'],
				dest: 'dist/css/style.min.css'
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
					'src/app/general.js',
					'src/app/gameApp.js',
					'src/app/gameAppController.js',
					'src/app/components/*.component.js'
				],
				dest: 'dist/js/index.js'
			}
		},

		// Copy Dependencies
		copy: {
			'dev-js': {
				files: [
					{
						flatten: true,
						expand: true,
						cwd: '../node_modules/',
						src: [
							'angular/angular.js',
							'angular-route/angular-route.js',
							'socket.io/client-dist/socket.io.js'
						],
						dest: 'dist/js/utils'
					}
				]
			},
			'prod-js': {
				files: [
					{
						flatten: true,
						expand: true,
						cwd: '../node_modules/',
						src: [
							'angular/angular.min.js',
							'angular-route/angular-route.min.js',
							'socket.io/client-dist/socket.io.min.js'
						],
						dest: 'dist/js/utils',
						rename: function(dest, src) {
							// Remove .min from filename so HTML can reference .js for both dev and prod
							return dest + '/' + src.replace('.min.js', '.js');
						}
					}
				]
			},
			assets: {
				files: [
					{
						expand: true,
						cwd: 'src/assets/',
						src: ['**/*'],
						dest: 'dist/'
					},
					{
						expand: true,
						cwd: 'src/',
						src: ['index.html'],
						dest: 'dist/'
					}
				]
			}
		},

		// Clean Build Artifacts
		clean: {
			css: ['dist/css/'],
			js: ['dist/js/'],
			all: ['dist/']
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
				src: ['dist/js/index.js'],
				dest: 'dist/js/index.min.js'
			}
		},

		// Watch for Changes
		watch: {
			options: {
				livereload: true,
				spawn: false
			},
			js: {
				files: ['src/app/**/*.js'],
				tasks: ['concat:js', 'uglify:js'],
				options: {
					event: ['changed', 'added']
				}
			},
			css: {
				files: ['src/styles/less/**/*.less'],
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
	grunt.registerTask('build-dev', ['clean:all', 'less:dev', 'copy:dev-js', 'copy:assets', 'concat']);
	grunt.registerTask('build-prod', ['clean:all', 'less:prod', 'copy:prod-js', 'copy:assets', 'concat', 'uglify']);
	
	// Helper Tasks
	grunt.registerTask('styles', ['less:dev']);
	grunt.registerTask('scripts', ['concat:js', 'uglify:js']);
	
	// Log task completion
	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};