## v0.2.0 - unreleased

* Fix infinite loop issue that arises when one model is wrapped twice.
  (@anton-ryzhov, 21)

* Fix nested collections support. (#13)

* Internal: update test suite to Mocha. (@rstacruz, #17, #18)

* List Backbone and Ractive as peer dependencies. (@rstacruz, #19)

* Update required versions of Backbone and Ractive to allow future versions.
  (@rstacruz, #19)

* Use Backbone's `model.set` instead of `model.reset`. Fixes Backbone 1.1.2
  support. (@browniefed, #12, #10)

## v0.1.1 - June 9, 2014

* BREAKING CHANGE: Rename to `ractive-adaptors-backbone`.

* Fix `reset` issue when performing `set('model', null)`. (@bartsqueezy, #3)

* Fix browserify compatibility. (@ahdinosaur, #1)

## v0.1.0 - October 30, 2013

* Initial release as `ractive-backbone`.
