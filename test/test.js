/* jshint expr: true */
require( 'mocha-clean/brief' );
var mdescribe = require( 'mocha-repeat' );
var expect    = require( 'chai' ).expect;
var proxy     = require( 'proxyquire' );

var libs = {
	ractive: {
		'0.6.0': require( '../vendor/ractive/ractive-edge.js' ),
		'0.5.8': require( '../vendor/ractive/ractive-0.5.8.js' ),
		'0.5.0': require( '../vendor/ractive/ractive-0.5.0.js' ),
	},
	backbone: {
		'1.1.2': require( '../vendor/backbone/backbone-1.1.2.js' ),
		'1.0.0': require( '../vendor/backbone/backbone-1.0.0.js' ),
	}
};

function tests( name, fn ) {
	mdescribe( 'Ractive', libs.ractive, function (Ractive, version) {
		mdescribe( 'Backbone', libs.backbone, function (Backbone, version) {
			describe( name, function () {
				fn(Ractive, Backbone);
			});
		});
	});
}

tests( 'Ractive-adaptors-backbone', function (Ractive, Backbone) {
	var Adaptor, model, ractive, collection;

	/*
	 * Load the library
	 */

	before(function () {
		proxy( '../ractive-adaptors-backbone.js', {
			ractive: Ractive,
			backbone: Backbone
		});

		Adaptor = Ractive.adaptors.Backbone;
		Ractive.defaults.adapt.push('Backbone');
	});

	/*
	 * Basic sanity tests
	 */

	describe( 'Sanity tests', function () {

		it( 'adaptor exists and is an object', function () {
			expect( Ractive.adaptors.Backbone ).is.a( 'object' );
		});

		it( 'Backbone exists', function () {
			expect( Backbone ).is.a( 'object' );
			expect( Backbone.Model ).is.a( 'function' );
		});

	});

	/*
	 * Adaptor filter
	 */

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

	/*
	 * Models
	 */

	describe( 'models', function () {
		beforeEach(function () {
			model = new Backbone.Model();
			ractive = new Ractive();
		});

		it( 'works', function () {
			ractive.set( 'model', model );
			model.set( 'message', 'hello' );

			expect( ractive.get('model.message') ).eql( 'hello' );
		});

		it( 'sees model values before', function () {
			model = new Backbone.Model({ message: 'hello' });
			ractive.set( 'model', model );

			expect( ractive.get('model.message') ).eql( 'hello' );
		});

		it( 'propagates changes back to the model', function () {
			ractive.set( 'model', model );
			ractive.set( 'model.message', 'hello' );

			expect( ractive.get('model.message') ).eql( 'hello' );
		});

		it( 'accounts for model listeners', function (next) {
			model.on( 'change:message', function ( m, a, b ) {
				next();
			});

			ractive.set( 'model', model );
			ractive.set( 'model.message', 'hello' );
		});
	});

	/*
	 * Collections
	 */

	describe( 'collections', function () {
		var MyModel, MyCollection, list;

		beforeEach(function () {
			MyModel = Backbone.Model.extend();
			MyCollection = Backbone.Collection.extend({
				model: MyModel
			});
		});

		beforeEach(function () {
			list = new MyCollection();
		});

		it( 'works', function () {
			ractive = new Ractive({
				template: '{{#list}}{{name}}{{/list}}'
			});
			ractive.set('list', list);
			list.reset( [ { name: 'Moe' }, { name: 'Larry' }, { name: 'Curly' } ] );

			expect(ractive.toHTML()).eql('MoeLarryCurly');
		});
	});

});
