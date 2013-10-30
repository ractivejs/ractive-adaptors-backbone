module.exports = function ( grunt ) {

	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		jshint: {
			main: 'src/**/*.js',
			options: {
				strict: true,
				unused: true,
				undef: true,
				smarttabs: true,
				globals: {
					define: true,
					module: true,
					require: true,
					window: true
				}
			}
		},

		concat: {
			bundle: {
				src: 'src/Ractive-Backbone.js',
				dest: 'tmp/Ractive-Backbone.js'
			},
			options: {
				process: {
					data: {
						VERSION: '<%= pkg.version %>'
					}
				}
			}
		},

		qunit: {
			files: [ 'test/index.html' ]
		},

		uglify: {
			bundle: {
				src: 'tmp/Ractive-Backbone.js',
				dest: 'tmp/Ractive-Backbone.min.js'
			}
		},

		copy: {
			bundle: {
				files: [{
					cwd: 'tmp/',
					src: '*.js',
					dest: '',
					expand: true
				}]
			}
		}
		
	});

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );

	grunt.registerTask( 'default', [
		'jshint',
		'concat',
		'qunit',
		'uglify',
		'copy'
	]);

};