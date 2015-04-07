/* jshint expr: true */
require( 'mocha-clean/brief' );
var mdescribe = require( 'mocha-repeat' );
var expect    = require( 'chai' ).expect;
var proxy     = require( 'proxyquire' );

var libs = {
	ractive: {
		'0.7.2': require( '../vendor/ractive/ractive-0.7.2.js' ),
		'0.6.0': require( '../vendor/ractive/ractive-0.6.0.js' ),
		'0.5.8': require( '../vendor/ractive/ractive-0.5.8.js' ),
		'0.5.0': require( '../vendor/ractive/ractive-0.5.0.js' ),
		'0.4.0': require( '../vendor/ractive/ractive-0.4.0.js' ),
	},
	backbone: {
		'1.1.2': require( '../vendor/backbone/backbone-1.1.2.js' ),
		'1.0.0': require( '../vendor/backbone/backbone-1.0.0.js' ),
	}
};

function tests( name, fn ) {
	mdescribe( 'Ractive', libs.ractive, function ( Ractive, version ) {
		mdescribe( 'Backbone', libs.backbone, function ( Backbone, version ) {
			describe( name, function () {
				fn( Ractive, Backbone );
			});
		});
	});
}

tests( 'Ractive-adaptors-backbone', function ( Ractive, Backbone ) {
	var Adaptor, model, ractive, collection;

	/*
	 * Load the library
	 */

	before(function () {
		Adaptor = proxy( '../dist/ractive-adaptors-backbone.js', {
			ractive: Ractive,
			backbone: Backbone
		});

		Adaptor.Backbone = Backbone;

		Ractive.adaptors.Backbone = Adaptor;
		Ractive.defaults.adapt.push( 'Backbone' );
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
		});

		beforeEach(function () {
			if (Ractive.VERSION === '0.4.0')
				ractive = new Ractive({ adaptor: '' });
			else
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

		// See: https://github.com/ractivejs/ractive-adaptors-backbone/pull/12
		it( 'works with POJO reset', function () {
			ractive.set( 'model', model );
			ractive.set( 'model', { message: 'hello' } );

			expect( model.get('message') ).eql( 'hello' );
		});

		it( 'uses .toJSON() to fetch model attributes', function(next) {
			var Model = Backbone.Model.extend({
				toJSON: function() {
					return {
						fullname: this.attributes.firstname + ' ' + this.attributes.lastname
					}
				}
			});

			model = new Model({ firstname: 'Joe', lastname: 'Doe' });

			ractive.set( 'model', model );

			expect( ractive.get('model.fullname') ).eql( 'Joe Doe' );

			next();
		});
	});

	/*
	 * Model reset
	 */

	describe( 'resetting to new models', function () {
		var newModel;

		beforeEach(function () {
			ractive = new Ractive({ template: "{{#model}}{{name}}{{/model}}" });
			model = new Backbone.Model({ name: "Louie" });
			newModel = new Backbone.Model({ name: "Miles" });

			ractive.set( 'model', model );
			ractive.set( 'model', newModel );
		});

		it( 'handles resetting to new models', function () {
			expect( ractive.get('model').cid ).eql( newModel.cid );
		});

		it( 'stops listening to old model', function () {
			model.set( 'name', 'Ella' );
			expect( ractive.toHTML() ).eql( 'Miles' );
		});

		it( 'listens to the new model', function () {
			newModel.set( 'name', 'Frank' );
			expect( ractive.toHTML() ).eql( 'Frank' );
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
			ractive = new Ractive({
				template: '{{#list}}{{name}}{{/list}}'
			});
			ractive.set('list', list);
			list.reset( [ { name: 'Moe' }, { name: 'Larry' }, { name: 'Curly' } ] );
		});

		it( 'works', function () {
			expect( ractive.toHTML() ).eql( 'MoeLarryCurly' );
		});

		it( 'responds to model changes', function () {
			var moe = list.at( 0 );
			moe.set( 'name', 'Joe' );
			expect( ractive.toHTML() ).eql( 'JoeLarryCurly' );
		});

		it( 'responds to deletions', function () {
			var moe = list.at( 0 );
			list.remove( moe );
			expect( ractive.toHTML() ).eql( 'LarryCurly' );
		});

		it( 'responds to additions', function () {
			list.push({ name: 'Susy' });
			expect( ractive.toHTML() ).eql( 'MoeLarryCurlySusy' );
		});

		it( 'handles resets to array', function () {
			ractive.set('list', [ { name: 'Homer' }, { name: 'Bart' } ] );
			expect( ractive.toHTML() ).eql( 'HomerBart' );
		});

		it( 'handles resets to another collection', function () {
			var newCollection = new MyCollection([
				{ name: 'George' }, { name: 'Ringo' }
			]);

			ractive.set('list', newCollection);
			expect( ractive.toHTML() ).eql( 'GeorgeRingo' );
		});
	});

	/*
	 * Nested collections
	 */

	describe( 'nested collections', function () {
		var submodel, sublist, model, list;

		beforeEach(function () {
			submodel = new Backbone.Model({ message: 'hello' });
			sublist = new Backbone.Collection( [ submodel ] );
			model = new Backbone.Model({ sublist: sublist });
			list = new Backbone.Collection( [ model ] );

			ractive = new Ractive({
				template: '{{#list}}{{heading}}{{#sublist}}{{message}}{{/sublist}}{{/list}}'
			});

			ractive.set('list', list);
		});

		it( 'works', function () {
			expect( ractive.get( 'list.0.sublist.0.message' ) ).eql( 'hello' );
		});

		it( 'renders HTML', function () {
			expect( ractive.toHTML() ).eql( 'hello' );
		});

		it( 'responds to changes in submodel', function () {
			submodel.set( 'message', 'hola' );
			expect( ractive.toHTML() ).eql( 'hola' );
		});

		it( 'responds to sublist additions', function () {
			sublist.push( new Backbone.Model({ message: 'howdy' }) );
			expect( ractive.toHTML() ).eql( 'hellohowdy' );
		});

		it( 'responds to sublist deletions', function () {
			var m = new Backbone.Model({ message: 'howdy' });
			sublist.push(m);
			sublist.remove(m);
			expect( ractive.toHTML() ).eql( 'hello' );
		});
	});

});
