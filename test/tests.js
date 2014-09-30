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

}());
