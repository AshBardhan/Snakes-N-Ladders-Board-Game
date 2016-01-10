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
				files: ['public/js/**/*.js', '!public/js/interaction*.js'],
				tasks: ['concat:js', 'uglify:js']
			},
			'css' : {
				files: ['public/less/**/*.less'],
				tasks: ['less', 'cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less', 'concat', 'uglify', 'cssmin']);
};