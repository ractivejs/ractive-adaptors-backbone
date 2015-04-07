# ractive-adaptors-backbone

Use Backbone models and collections in your [Ractive] components.<br>
**[View demo ›][Example]**

[![Status](http://img.shields.io/travis/ractivejs/ractive-adaptors-backbone/master.svg?style=flat)](https://travis-ci.org/ractivejs/ractive-adaptors-backbone "See test builds")

*Find more Ractive.js plugins at
[docs.ractivejs.org/latest/plugins](http://docs.ractivejs.org/latest/plugins)*

## Installation

Include `ractive-adaptors-backbone.min.js` on your page below Ractive, e.g:

```html
<script src='lib/ractive.min.js'></script>
<script src='lib/ractive-adaptors-backbone.min.js'></script>
```

To get ractive-adaptors-backbone you can:

#### Use CDN

    //cdn.jsdelivr.net/ractive.adaptors-backbone/latest/ractive-adaptors-backbone.min.js

#### Use bower

    $ bower i ractive-adaptors-backbone

#### Use npm

    $ npm install --save ractive-adaptors-backbone

#### Download

- [Download the latest release](https://github.com/ractivejs/ractive-adaptors-backbone/releases).

## Usage

If you're using `<script>` tags to manage your dependencies, everything is already set up, and you can use the adaptor like so:

```js
var user = new Backbone.Model({
  name: 'world'
});

var ractive = new Ractive({
  el: 'main',
  template: '<h1>Hello {{user.name}}!</h1>',
  data: {
    user: user
  }
});

// If you interact with the model, the view will change
user.set( 'name', 'everybody' );
```

If `Backbone` isn't a global variable (e.g. you're using Browserify or RequireJS), you need to *register* it:

```js
// Example with CommonJS modules - it also works with AMD
var Backbone = require( 'backbone' );
var Ractive = require( 'ractive' );
var backboneAdaptor = require( 'ractive-adaptors-backbone' );

backboneAdaptor.Backbone = Backbone;

var ractive = new Ractive({
  el: 'main',
  template: '<h1>Hello {{user.name}}!</h1>',
  data: {
    user: user
  },

  // this line tells Ractive to look out
  // for Backbone models
  adapt: [ backboneAdaptor ]
});
```


## License

MIT

[Example]: http://examples.ractivejs.org/backbone
[Ractive]: http://www.ractivejs.org
