module.exports = function ( grunt ) {

	'use strict';

	grunt.registerTask( 'default', [
		'jshint',
		'concat',
		'qunit',
		'uglify',
		'copy'
	]);

};
