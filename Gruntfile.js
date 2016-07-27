/*
 *	This code was created for Printr B.V. It is open source under the formideos-interface package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function (grunt) {
	// window = {};

	var json = {
		pkg: grunt.file.readJSON('package.json'),

		/*
		 *	Clean folders before copying.
		 */
		clean: {
			fonts: ['./public/assets/*'],
			tmp: ['./tmp']
		},

		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: './bower_components/formide-platform/dist',
						src: '**/*.*',
						dest: './public/assets'
					}
				]
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['package.json', 'bower.json'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'origin',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
				globalReplace: false,
				prereleaseName: false,
				regExp: false
			}
		}
	};

	require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

	grunt.initConfig();
	grunt.config.merge(json);

	/*
	 * Load NPM Plugins
	 */
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-bump');

	/*
	 * Register Tasks
	 */
	grunt.registerTask('build:dist', ['copy:dist']);
	grunt.registerTask('default', ['build:dist'])
};
