/* jshint expr: true */
require( 'mocha-clean/brief' );
var expect = require( 'chai' ).expect;
var proxy = require( 'proxyquire' );

describe( 'Ractive-adaptors-backbone', function () {
	var Ractive, Backbone, Adaptor;

	before(function () {
		Ractive = require('../vendor/ractive/edge/ractive.js');
		Backbone = require('backbone');
		proxy( '../ractive-adaptors-backbone.js', {
			ractive: Ractive
		});
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

	it( 'Works', function () {
		var model = new Backbone.Model();
		var ractive = new Ractive({ adapt: ['Backbone'] });

		ractive.set( 'model', model );
		model.set( 'message', 'hello' );

		expect( ractive.get('model.message') ).eql( 'hello' );
	});

});
