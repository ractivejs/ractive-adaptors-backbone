Developer notes
===============

Testing:

    npm test

Building .min.js:

    npm run prepublish

Releasing new versions:

    # update version numbers
      bump *.json *bone.js

    # update changelog with date
      vim CHANGELOG.md

    # test
      npm test

    # publish to npm (this will already build .min)
      npm publish

      git release v1.0.0

