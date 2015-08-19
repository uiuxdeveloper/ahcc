module.exports = function(grunt) {

	'use strict';
	
	/**
	 * Load grunt tasks automatically
	 */
	require('load-grunt-tasks')(grunt);
	

	/**
	 * Time how long tasks take. Can help when optimizing build times
	 */
	require('time-grunt')(grunt);
	
	/**
	 * Define the configuration for all the tasks
	 */
	grunt.initConfig({
	
		/**
		 * Project params
		 */
		config: {
			app: 'src',			// location of source directory
			dist: 'build',		// location to place build assets
			bower: 'lib',		// location of vendor files added by bower
			temp: '.tmp',		// location of temp directory used during build processes
			cdn: ''				// location of CDN.  Value will be used to prepend to relative asset paths during build process
		},
		
		/**
		 * Usmin Prepare
		 * @Description Reads HTML usemin blocks to enable smarts builds that automatically concat, minify and revision files. Creates configurations in memory so additional tasks can operate on them.
		 */
		useminPrepare: {
			options: {
				dest: '<%= config.dist %>',
				flow: {
					html: {
						steps: {
							js: ['concat'],
							css: ['concat']
						},
						post: {}
					}
				}
			},
			html: [
				'<%= config.app %>/*.html'
			]
		},
		
		/**
		 * Usemin
		 * @Description	Performs rewrites based on useminPrepare configuration
		 */
		usemin: {
			options: {
				assetsDirs: [
					'<%= config.dist %>/img',
					'<%= config.dist %>/css'
				]
			},
			html: ['<%= config.dist %>/*.html'],
			css: ['<%= config.dist %>/*.css']
		},
		
		/**
		 * Minify HTML
		 */
		htmlmin: {
			build: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeComments: true,
					removeCommentsFromCDATA: true,
					removeEmptyAttributes: true,
					useShortDoctype: true
				},
				files: [{
					// Set to true to enable the following options
					expand: true,
					cwd: '<%= config.dist %>/',
					src: [
						'{,*/}*.html'
					],
					dest: '<%= config.dist %>/'
				}]
			}
		},
		
		/**
		 * Minfiy Images
		 */
		//imagemin: {
		//	options: {
		//		optimizationLevel: 7, // 0 to 7
		//		pngquant: true
		//	},
		//	build: {
		//		files: [{
		//			expand: true,
		//			cwd: '<%= config.app %>/img',
		//			src: ['{,*/}*.{jpg,png,gif}'],
		//			dest: '<%= config.dist %>/img'
		//		}]
		//	}
		//},
		
		/**
		 * Compile SASS
		 */
		compass: {
			dev:{
				options: {
					sassDir: '<%= config.app %>/scss',
					cssDir: '<%= config.app %>/css',
					imagesDir: '',
					javascriptDir: '<%= config.app %>/js',
					generatedImagesPath: '<%= config.app %>/img',
					generatedImagesDir: '<%= config.app %>/img/generated',
					httpGeneratedImagesPath: '../img',
					relativeAssets: false,
					assetCacheBuster: false
				}
			},
			build:{
				options: {
					sassDir: '<%= config.app %>/scss',
					cssDir: '<%= config.temp %>/css',
					imagesDir: '',
					javascriptDir: '<%= config.app %>/js',
					generatedImagesPath: '<%= config.dist %>/img',
					generatedImagesDir: '<%= config.dist %>/img/generated',
					httpGeneratedImagesPath: '../img',
					relativeAssets: false,
					assetCacheBuster: false
					//ouputStyle: "compressed"
				}
			}
		},
		
		/**
		 * Autoprefixer
		 * @Description Add vendor prefixed styles
		 */
		autoprefixer: {
			options: {
				diff: false,
				browsers: ['last 3 versions']
			},
			dev: {
				expand: true,
				cwd: '<%= config.app %>/css/',
				src: '**/*.css',
				dest: '<%= config.app %>/css/'
			},
			build: {
				expand: true,
				cwd: '<%= config.temp %>/css/',
				src: '**/*.css',
				dest: '<%= config.temp %>/css/'
			}
		},
		
		/**
		 * Modernizr
		 * @Description Generate a custom Modernzr build that includes only the tests you reference
		 */
		modernizr: {
			build: {
				devFile: '<%= config.app %>/<%= config.bower %>/modernizr/modernizr.js',
				outputFile: '<%= config.dist %>/js/modernizr.js',
				files: {
					src: [
						'<%= config.dist %>/css/{,*/}*.css',
						'<%= config.dist %>/js/{,*/}*.js'
					]
				},
				uglify: true
			}
		},
		
		/**
		 * JS Hint
		 * @Description Make sure code styles are up to par and there are no obvious mistakes
		 */
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js'
			]
		},
		
		/**
		 * Minify JS
		 */
		uglify: {
			options: {
				mangle: false,
				compress: {
					dead_code: true,
					drop_console: false
				}
			},
			build: {
				files: {
					'<%= config.dist %>/js/main.min.js': ['<%= config.dist %>/js/{,*/}*.js']
				}
			}
		},
		
		/**
		 * Watch
		 * @Description Watch for any changes
		 */
		watch: {
			options: {
				debounceDelay: 500,
				livereload: true
			},
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['newer:jshint']
			},
			html: {
				files: '<%= config.app %>/**/*.html'
			},
			styles: {
				files: [
					'<%= config.app %>/**/**/*.scss',
					'<%= config.app %>/**/**/*.css'
				],
				tasks: 'default'
			},
			scripts: {
				files: [
					'<%= config.app %>/js/**/*.js'
				],
				tasks: ['newer:jshint']
			}
		},
		
		/**
		 * Condense CSS
		 */
		cssc: {
			build: {
				options: {
					sortSelectors: true,
					lineBreaks: true,
					sortDeclarations:true,
					consolidateViaDeclarations:false,
					consolidateViaSelectors:false,
					consolidateMediaQueries:false,
				},
				files: {
					'<%= config.temp %>/css/main.css': '<%= config.temp %>/css/main.css'
				}
			}
		},
		
		/**
		 * Minify CSS
		 */
		cssmin: {
			build: {
				options: {
					report: 'gzip'
				},
				files: {
					'<%= config.dist %>/css/main.min.css': ['<%= config.temp %>/css/main.css']
				}
			}
		},

		/**
		 * CDN Prep
		 * @Description Prep paths for cdn inside html and css files
		 */
		cdn: {
			options: {
				cdn: '<%= config.cdn %>',
				flatten: true
			},
			dist: {
				src: ['<%= config.dist %>/*.html', '<%= config.dist %>/**/*.css']
			}
		},
		
		/**
		 * Copy
		 * @Description Copies remaining files to places other tasks can use
		 */
		copy: {
			styles: {
				// Set to true to enable the following options
				expand: true,
				dot: true,
				cwd: '<%= config.app %>/css',
				dest: '<%= config.temp %>/css',
				src: '**/*.css'
			},
			build: {
				// Set to true to enable the following options
				expand: true,
				dot: true,
				cwd: '<%= config.app %>',
				dest: '<%= config.dist %>/',
				src: [
					'data/**/*.json',
					'*.html',
					'img/**/*.ico',
					'img/**/*.png',
					'img/**/*.jpg',
					'img/**/*.gif'
				]
			}
		},
		
		/**
		 * Clean Folders
		 * @Description Empties folders to start fresh
		 */
		clean: {
			dev: {
				dot: true,
				src: [
					'<%= config.temp %>/',
					'<%= config.app %>/css/**/*.css'
				]
			},
			build: {
				dot: true,
				src: [
					'<%= config.temp %>/',
					'<%= config.dist %>/'
				]
			}
		},
		
		/**
		 * jsDocs
		 */
		jsdoc : {
			dist : {
				src: ['<%= config.app %>/js/**/*.js'],
				options: {
					destination: '<%= config.dist %>/docs'
				}
			}
		},

		/**
		 * Grunt Server Settings
		 */
		connect: {
			options: {
				//port: 9415,
				open: true,
				livereload: 35729,
				hostname: 'localhost',

				middleware: function (connect, options) {
					var optBase = (typeof options.base === 'string') ? [options.base] : options.base;
					return [require('connect-modrewrite')(['!(\\..+)$ / [L]'])].concat(optBase.map(function(path){ return connect.static(path); }));
			    }
			},
			devserver: {
				options: {
					port: 9999,
					open: true,
					base: '<%= config.app %>'
				}
			},
			build: {
				options: {
					port: 9998,
					base: '<%= config.dist %>',
					livereload: true,
					keepalive: true
				}
			}
		}
	});

	/**
	 * Default Grunt Task
	 */
	grunt.registerTask('default', [
		'clean:dev',					// clean the tmp directory
		'compass:dev',					// compile sass/compass
		'autoprefixer:dev',				// add vendor prefixed styles
		'copy:styles',					// copy css from app into .tmp folder
		'newer:jshint',					// validate js
		'connect:devserver',			// open connection to dev site
		'watch'							// keep connection open and wathc for changes
	]);
	
	/**
	 * Build Grunt Task
	 * @Description Creates a build package in the build directory based on the src assets
	 */
	grunt.registerTask('build', [
		'clean:build',					// clean the build directory
		'useminPrepare',				// prepare usemin
		'compass:build',				// build css from sass
		//'imagemin:build',				// minify images
		'concat',						// needed for usemin default concat
		'autoprefixer:build',			// add vendor prefixed styles
		'uglify',						// needed for usemin to minify js
		'copy:build',					// copy assets from src into build
		//'cdn',						// update relative and absolute paths to reference cdn
		'cssc:build',					// concat css tags
		'cssmin:build',					// minify CSS and copy it into the /build directory
		'usemin',						// compress js
		'htmlmin:build',				// minify html
		'uglify:build',					// minify js and angular
		'jsdoc',						// jsdoc auto documentation
		'connect:build'
	]);
};