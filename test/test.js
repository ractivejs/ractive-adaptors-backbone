/* jshint expr: true */
require( 'mocha-clean/brief' );
var mdescribe = require( 'mocha-repeat' );
var expect    = require( 'chai' ).expect;
var proxy     = require( 'proxyquire' );

var libs = {
	ractive: {
		'0.6.0': require( '../vendor/ractive/edge/ractive.js' ),
		'0.5.8': require( '../vendor/ractive/0.5.8/ractive.js' ),
		'0.5.0': require( '../vendor/ractive/0.5.0/ractive.js' ),
	},
};

mdescribe( 'Ractive-adaptors-backbone', libs.ractive, function (Ractive, version) {
	var Backbone, Adaptor;

	before(function () {
		Backbone = require('backbone');
		proxy( '../ractive-adaptors-backbone.js', { ractive: Ractive });
		Adaptor = Ractive.adaptors.Backbone;
	});

	it( 'adaptor exists and is an object', function () {
		expect( Ractive.adaptors.Backbone ).is.a( 'object' );
	});

	it( 'Backbone exists', function () {
		expect( Backbone ).is.a( 'object' );
		expect( Backbone.Model ).is.a( 'function' );
	});

	describe( 'filter', function () {
		it( 'detects models', function () {
			var model = new Backbone.Model();
			expect( Adaptor.filter(model) ).true;
		});

		it( 'detects collections', function () {
			var collection = new Backbone.Collection();
			expect( Adaptor.filter(collection) ).true;
		});

		it( 'returns false on plain objects', function () {
			var object = {};
			expect( Adaptor.filter(object) ).false;
		});
	});

	it( 'works', function () {
		var model = new Backbone.Model();
		var ractive = new Ractive({ adapt: ['Backbone'] });

		ractive.set( 'model', model );
		model.set( 'message', 'hello' );

		expect( ractive.get('model.message') ).eql( 'hello' );
	});

});
