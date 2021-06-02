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
				src: ['public/js/gameApp.js',  'public/js/gameAppController.js'],
				dest: 'public/js/interaction.js'
			}
		},
		copy: {
			'dev-js': {
				files: [
					{
						flatten: true,
						expand: true,
						cwd: 'node_modules/',
						src: [
							'angular/angular.js',
							'angular-ui-router/release/angular-ui-router.js'
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
							'angular-ui-router/release/angular-ui-router.min.js'
						],
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
				tasks: ['less']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build-dev', ['clean', 'less:dev', 'copy:dev-js', 'concat']);
	grunt.registerTask('build-prod', ['clean', 'less:prod', 'copy:prod-js', 'concat', 'uglify']);
};