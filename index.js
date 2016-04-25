var SM = { };

/* new class style for v2:

// note: no base class, mixin only based code sharing
DefineClass([mixin_one, mixin_two, ..., {
  constructor: function () {},

  normalFunction: function () {},

  chainableEvent: SM.event(function () {

  })
}]);

implicit function :
  trigger: function (event, ...arguments);
    - used to trigger events on objects, masks how the event is implemented and where, and calls it on the right context
 */

//--- CLASSES ---//
(function () {
  function BaseClass() {}

  function eventWrapper() {
    return [];
  }

  SM.event = function (fn) {
    fn.isSMEvent = true;
    return fn;
  };

  SM.DefineClass = function (mixins) {
    function Constructor() {}
    Constructor.prototype = new BaseClass();

    mixins.forEach(function (mixin) {
      Object.keys(mixin).forEach(function (name) {
        var fn = mixin[ name ];

        if (fn.isSMEvent) {
          if (!Constructor.prototype[ name ]) {
            Constructor.prototype[ name ] = eventWrapper();
          }
          Constructor.prototype[ name ].push(fn);
        } else {
          Constructor.prototype[ name ] = fn;
        }
      });
    });

    return Constructor
  };
}());

//--- MODULES ---//
(function () {
  var moduleDefinitions = {};
  var evaluatedModules = {};
  var evaluationStack = [];

  function require(moduleName) {
    if (evaluationStack.indexOf(moduleName) > -1) {
      throw "Circular dependencies not supported: " + moduleName + " required while still being evaluated";
    }

    var module = evaluatedModules[ moduleName ];
    if (module) {
      return module;
    }

    var moduleDefinition = moduleDefinitions[ moduleName ];
    if (moduleDefinition) {
      evaluationStack.push(moduleName);
      module = evaluatedModules[ moduleName ] = moduleDefinition(require);
      evaluationStack.pop();

      return module;
    }

    throw "No module found: " + moduleName;
  }

  SM.DefineModule = function (moduleName, moduleDefinition) {
    if (moduleDefinitions[ moduleName ]) {
      throw "Duplicate module definition: " + moduleName;
    }

    moduleDefinitions[ moduleName ] = moduleDefinition;
  };

  window.addEventListener('load', function () {
    require('main');
  });

}());
