module.exports = function (grunt) {
	grunt.initConfig({
		less: {
			development: {
				src: ['public/less/style.less'],
				dest: 'public/css/style.css'
			}
		},
		concat: {
			options: {
				separator: '\n'
			},
			js: {
				src: ['public/js/general.js',  'public/js/game.js'],
				dest: 'public/js/interaction.js'
			}
		},
		uglify: {
			js: {
				src: ['public/js/interaction.js'],
				dest: 'public/js/interaction.min.js'
			}
		},
		cssmin: {
			css: {
				src: ['public/css/style.css'],
				dest: 'public/css/style.min.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['less', 'concat', 'uglify', 'cssmin']);
};