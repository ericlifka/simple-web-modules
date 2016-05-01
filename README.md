# simple-web-modules
A simple module system for simple web components
Simple Modules provides two concepts: classes and modules.

### Classes
Classes are a convenience for turning multiple mixin objects into a single constructor function:
```
var mixinA = { test1: function () { } };
var mixinB = { propM1: 55 };
var MyClassConstructor = SM.DefineClass([ mixinA, mixinB, {
  propA: 1,
  propB: "my-class",
  doAThing: function () { /* ... */ }
}]);

var myInstance = new MyClassConstructor();
```
`myInstance` would now have all of the properties of the above objects:
`test1, propM1, propA, propB, doAThing`

## Development

No build system as yet, Simple Modules is provided in index.js for simple inclusion from bower.

Run tests with `npm test` or `mocha`
