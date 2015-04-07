const lockProperty = '_ractiveAdaptorsBackboneLock';

function acquireLock( key ) {
	key[lockProperty] = ( key[lockProperty] || 0 ) + 1;
	return function release() {
		key[lockProperty] -= 1;
		if ( !key[lockProperty] ) {
			delete key[lockProperty];
		}
	};
}

function isLocked( key ) {
	return !!key[lockProperty];
}

const adaptor = {
	// self-init, if being used as a <script> tag
	Backbone: ( typeof window !== 'undefined' && window.Backbone ) || null,

	filter ( object ) {
		if ( !adaptor.Backbone ) {
			throw new Error( 'Could not find Backbone. You must do `adaptor.Backbone = Backbone` - see https://github.com/ractivejs/ractive-adaptors-backbone#installation for more information' );
		}
		return object instanceof adaptor.Backbone.Model || object instanceof adaptor.Backbone.Collection;
	},
	wrap ( ractive, object, keypath, prefix ) {
		if ( object instanceof adaptor.Backbone.Model ) {
			return new BackboneModelWrapper( ractive, object, keypath, prefix );
		}

		return new BackboneCollectionWrapper( ractive, object, keypath, prefix );
	}
};

function BackboneModelWrapper ( ractive, model, keypath, prefix ) {
	this.value = model;

	model.on( 'change', this.modelChangeHandler = function () {
		const release = acquireLock( model );
		ractive.set( prefix( model.changed ) );
		release();
	});
}

BackboneModelWrapper.prototype = {
	teardown () {
		this.value.off( 'change', this.modelChangeHandler );
	},
	get () {
		return this.value.toJSON();
	},
	set ( keypath, value ) {
		// Only set if the model didn't originate the change itself, and
		// only if it's an immediate child property
		if ( !isLocked( this.value ) && keypath.indexOf( '.' ) === -1 ) {
			this.value.set( keypath, value );
		}
	},
	reset ( object ) {
		// If the new object is a Backbone model, assume this one is
		// being retired. Ditto if it's not a model at all
		if ( object instanceof adaptor.Backbone.Model || !(object instanceof Object) ) {
			return false;
		}

		// Otherwise if this is a POJO, reset the model
		//Backbone 1.1.2 no longer has reset and just uses set
		this.value.set( object );
	}
};

function BackboneCollectionWrapper ( ractive, collection, keypath ) {
	this.value = collection;

	collection.on( 'add remove reset sort', this.changeHandler = function () {
		// TODO smart merge. It should be possible, if awkward, to trigger smart
		// updates instead of a blunderbuss .set() approach
		const release = acquireLock( collection );
		ractive.set( keypath, collection.models );
		release();
	});
}

BackboneCollectionWrapper.prototype = {
	teardown () {
		this.value.off( 'add remove reset sort', this.changeHandler );
	},
	get () {
		return this.value.models;
	},
	reset ( models ) {
		if ( isLocked( this.value ) ) {
			return;
		}

		// If the new object is a Backbone collection, assume this one is
		// being retired. Ditto if it's not a collection at all
		if ( models instanceof adaptor.Backbone.Collection || Object.prototype.toString.call( models ) !== '[object Array]' ) {
			return false;
		}

		// Otherwise if this is a plain array, reset the collection
		this.value.reset( models );
	}
};

export default adaptor;