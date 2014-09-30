// Ractive-Backbone tests
// ======================
//
// This loads in the render.json sample file and checks that each compiled
// template, in combination with the sample data, produces the expected
// HTML.
//
// TODO: add moar samples

(function () {

	var fixture;

	var Adaptor = Ractive.adaptors.Backbone;

	test( 'Ractive.adaptors.Backbone exists and is an object', function ( t ) {
		t.ok( typeof Ractive.adaptors.Backbone === 'object' );
	});

	test( 'Backbone exists', function ( t ) {
		t.equal( typeof Backbone, 'object' );
		t.equal( typeof Backbone.Model, 'function' );
	});

	test( 'Adaptor.filter detects models', function ( t ) {
		var model = new Backbone.Model();
		t.equal( Adaptor.filter(model), true );
	});

	test( 'Adaptor.filter detects collections', function ( t ) {
		var collection = new Backbone.Collection();
		t.equal( Adaptor.filter(collection), true );
	});

	test( 'Adaptor.filter returns false on plain objects', function ( t ) {
		var object = {};
		t.equal( Adaptor.filter(object), false );
	});

	/*
	test( 'Works', function ( t ) {
		var model = new Backbone.Model();
		var ractive = new Ractive({ adapt: ['Backbone'] });

		ractive.set( 'model', model );
		model.set( 'message', 'hello' );

		t.equal( ractive.get('model.message'), 'hello' );
	});
	*/

}());
