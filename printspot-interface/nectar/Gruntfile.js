//var mozjpeg = require('imagemin-mozjpeg');

//Gruntfile
module.exports = function(grunt) {

//Initializing the configuration object
	grunt.initConfig({
		// Task configuration
		clean: {
		  	images: ["./public/assets/images/**/*.{png,jpg,gif}"],
		  	images_svg: ["./public/assets/images/**/*.svg"],
		},
		cleanempty: {
			options: {},
			src: ['./public/assets/images/**'],
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: './app/assets/images/',
						src: ['**/*.svg'],
						dest: './public/assets/images/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: './app/assets/fonts/',
						src: ['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff'],
						dest: './public/assets/fonts/',
						filter: 'isFile'
					},
					{
						expand: true, 
						cwd: './app/assets/components/octicons/octicons/',
						src: ['*.{eot,svg,tff,woff}'],
						dest: './public/assets/stylesheets/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: './app/assets/javascripts/partials/',
						src: ['**/*.html'],
						dest: './public/partials/',
						filter: 'isFile'
					}
				]
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			js_main: {
				src: [
					'./app/assets/components/modernizr/modernizr.js',
					'./app/assets/components/jquery/dist/jquery.js',
					'./app/assets/components/featherlight/src/featherlight.js',
					'./app/assets/components/chartjs/Chart.js',
					'./app/assets/components/bootstrap/dist/js/bootstrap.js',
					'./app/assets/javascripts/dependencies/chromeframe.js',
					'./app/assets/javascripts/dependencies/jquery.base64.js',
					'./app/assets/javascripts/dependencies/Three.js',
					'./app/assets/javascripts/dependencies/plane.js',
					'./app/assets/javascripts/dependencies/thingiview.js'

				],
				dest: './public/assets/javascripts/main.js',
			},
			js_angular: {
				src: [
					'./app/assets/components/ng-file-upload/angular-file-upload-html5-shim.js',
					'./app/assets/components/angular/angular.js',
					'./app/assets/components/angular-animate/angular-animate.js',
					'./app/assets/components/angular-resource/angular-resource.js',
					'./app/assets/components/angular-route/angular-route.js',
					'./app/assets/components/ng-file-upload/angular-file-upload.js',
					'./app/assets/components/ngDialog/js/ngDialog.js',
					'./app/assets/components/angular-socket-io/socket.min.js',
					'./app/assets/components/lodash/dist/lodash.underscore.js',
					'./app/assets/components/angular-elastic/elastic.js',
					'./app/assets/components/moment/moment.js',
					'./app/assets/javascripts/app.js',
					'./app/assets/javascripts/directives/**/*.js',
                    './app/assets/javascripts/services/**/*.js',
					'./app/assets/javascripts/controllers/**/*.js',
				],
				dest: './public/assets/javascripts/angular.js',
			},
			css_octicons: {
				src: [
					'./app/assets/components/octicons/octicons/octicons.css',
				],
				dest: './app/assets/sass/components/_octicons.scss',
			},
		},
		jshint: {
			options: {
				force: true,
				reporterOutput: './reports/jshint.xml'
			},
	    all: [
				'Gruntfile.js',
				'./app/assets/javascripts/**/*.js'
			]
		},
		compass: {                  // Task
			dist: {                   // Target
				options: {
					config: './config.rb',
					environment: 'production',
					outputStyle: 'compressed'
				}
			},
			dev: {                    // Another target
				options: {
					config: './config.rb',
					outputStyle: 'expanded'
				}
			}
		},
		scsslint: {
			allFiles: [
				'./app/assets/sass/',
			],
			options: {
				bundleExec: false,
				config: './app/assets/sass/csslint.yml',
				reporterOutput: './reports/csslint.xml',
				colorizeOutput: true,
				force: true
			},
		},
		uglify: {
			options: {
				mangle: false  // Use if you want the names of your functions and variables unchanged
			},
			main: {
				files: {
					'./public/assets/javascripts/main.js': './public/assets/javascripts/main.js',
				}
			},
			angular: {
				files: {
					'./public/assets/javascripts/angular.js': './public/assets/javascripts/angular.js',
				}
			},
		},
		imagemin: {                          // Task
			dynamic: {                         // Another target
				files: [{
					expand: true,                  // Enable dynamic expansion
					cwd: './app/assets/images/',  // Src matches are relative to this path
					src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
					dest: './public/assets/images/' // Destination path prefix
				}]
			}
		},
		githooks: {
	    post_commit: {
				options: {
					template: 'hooks/sync.js'
				},
				'post-commit': true,
	    }
	  },
		styleguide: {
	    options: {
	      framework: {
        	name: 'kss'
      	}
	    },
	    all: {
				files: [{
        	'public/styleguide': 'assets/sass/**/*.scss'
      	}]
	    }
	  },
		watch: {
		  stylesheets: {
		    files: './app/assets/sass/**/*.sccs',
		    tasks: ['compass:dev'],
		},
		javascripts: {
			files: './app/assets/javascripts/**/*.js',
			tasks: ['concat:js_main', 'concat:js_angular'],
		},
		images: {
		    files: './app/assets/images-orig/**/*.{png,jpg,gif}',
		    tasks: ['clean:images', 'imagemin'],
		},
		images_svg: {
		    files: './app/assets/images-orig/**/*.svg',
		    tasks: ['clean:images_svg', 'copy'],
		},
	},

	});

	// // Plugin loading
	grunt.loadNpmTasks('grunt-contrib-concat');
	// grunt.loadNpmTasks('grunt-scss-lint');
	grunt.loadNpmTasks('grunt-contrib-compass');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-cleanempty');
	// grunt.loadNpmTasks('grunt-styleguide');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-githooks');

	// grunt.registerTask('test', ['jshint', 'scsslint']);
  	grunt.registerTask('build:dist', ['clean', 'cleanempty', 'copy', 'concat', 'compass:dist', 'uglify', 'imagemin']);
	grunt.registerTask('build:dev', ['clean', 'cleanempty', 'copy', 'concat', 'compass:dev', 'imagemin']);
  	grunt.registerTask('default', ['build:dev']);
};
