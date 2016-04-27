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
    var wrapper = [];
    wrapper.isSMEventWrapper = true;

    return wrapper;
  }

  SM.event = function (fn) {
    fn.isSMEvent = true;
    return fn;
  };

  SM.DefineClass = function (mixins) {
    function Constructor() {}
    Constructor.prototype = new BaseClass();
    var proto = Constructor.prototype;

    mixins.forEach(function (mixin) {
      Object.keys(mixin).forEach(function (name) {
        var fn = mixin[ name ];

        if (fn.isSMEvent) {

          if (!proto[ name ]) {
            proto[ name ] = eventWrapper();
          }

          if (proto[ name ].isSMEventWrapper) {
            proto[ name ].push(fn);
          } else {
            throw 'Error Creating class: cannot mix SM events and regular functions on the same name key: "' + name + '"';
          }

        } else {

          if (!proto[ name ] || !proto[ name ].isSMEventWrapper) {
            proto[ name ] = fn;
          } else {
            throw 'Error Creating class: cannot mix SM events and regular functions on the same name key: "' + name + '"';
          }

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

  function hardReset() {
    if (evaluationStack.length > 0) {
      throw "SM: cannot reset module system while module execution is still active";
    }

    moduleDefinitions = {};
    evaluatedModules = {};
  }

  function runMain() {
    require('main');
  }

  if (typeof module !== 'undefined' && module.exports) {

    /* Node.js context: provide module internals for testing */
    module.exports = SM;
    module.exports.runMain = runMain;
    module.exports.hardReset = hardReset;

  } else {

    /* Browser context: tie into load to run main */
    if (document.readyState !== 'loading') {
      setTimeout(runMain, 0);
    } else {
      document.addEventListener('DOMContentLoaded', runMain);
    }

  }

}());
