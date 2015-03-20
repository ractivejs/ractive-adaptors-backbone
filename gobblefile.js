var gobble = require( 'gobble' );

gobble.cwd( __dirname );

module.exports = gobble( 'src' )
.transform( 'babel', {
	blacklist: [ 'es6.modules', 'useStrict' ],
	sourceMap: false
})
.transform( 'esperanto-bundle', {
	entry: 'ractive-adaptors-backbone',
	type: 'umd',
	name: 'Ractive.adaptors.Backbone',
	sourceMap: false
});