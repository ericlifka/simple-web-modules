var should = require('should');
var SM = require('../index');

describe('SM Classes', function () {

  describe('SM.event', function () {
    it('should return the same function', function () {
      var fn = function () {};
      var ret = SM.event(fn);

      ret.should.be.exactly(fn);
    });

    it('should set an identifier on the function', function () {
      var fn = function () {};
      SM.event(fn);

      fn.should.have.property('isSMEvent');
    });
  });

  describe('SM.DefineClass', function () {
    it('should return a constructor function', function () {
      var cl = SM.DefineClass();
      (typeof cl).should.equal("function");
    });

    it('should expose properties on instances', function () {
      var cl = SM.DefineClass([{
        propA: 1,
        propB: function () {}
      }]);
      var obj = new cl();

      obj.should.have.property('propA');
      obj.should.have.property('propB');
      obj.should.not.have.ownProperty('propA');
      obj.should.not.have.ownProperty('propB');
    });

    it('should support multiple objects', function () {
      var cl = SM.DefineClass([
        { propA: 1 },
        { propB: 2 }
      ]);
      var obj = new cl();

      obj.should.have.property('propA', 1);
      obj.should.have.property('propB', 2);
    });

    it('should overwrite properties with last first wins', function () {
      var cl = SM.DefineClass([
        { propA: 1 },
        { propA: 2 }
      ]);
      var obj = new cl();

      obj.should.have.property('propA', 2);
    });

    it('should put events into an event container', function () {
      var fn = function () { };
      var cl = SM.DefineClass([{
        eventA: SM.event(fn)
      }]);
      var obj = new cl();

      obj.should.have.property('eventA');
      obj.eventA.should.have.property('isSMEventWrapper');
      obj.eventA[ 0 ].should.be.exactly(fn);
    });

    it('should allow events to be triggered by name', function () {
      var called = false;
      var cl = SM.DefineClass([{
        myEvent: SM.event(function () {
          called = true;
        })
      }]);
      var obj = new cl();

      obj.trigger('myEvent');
      called.should.equal(true);
    });

    it('should trigger all events in the correct sequence', function () {
      var calledA = false;
      var calledB = false;
      var calledC = false;
      var cl = SM.DefineClass([
        {
          myEvent: SM.event(function () {
            // This should be called before the other two.
            calledB.should.equal(false);
            calledC.should.equal(false);
            calledA = true;
          })
        },
        {
          myEvent: SM.event(function () {
            // This should be called after A but before C.
            calledA.should.equal(true);
            calledC.should.equal(false);
            calledB = true;
          })
        },
        {
          myEvent: SM.event(function () {
            // Thhis should be called last.
            calledA.should.equal(true);
            calledB.should.equal(true);
            calledC = true;
          })
        }
      ]);
      var obj = new cl();

      obj.trigger('myEvent');
      calledA.should.equal(true);
      calledB.should.equal(true);
      calledC.should.equal(true);
    });

    it('should pass any supplied arguments to every event in the chain', function () {
      var calledA = false;
      var calledB = false;
      var cl = SM.DefineClass([
        {
          myEvent: SM.event(function (a, b, c) {
            calledA = true;
            a.should.equal(1);
            b.should.equal(2);
            c.should.equal(3);
          })
        },
        {
          myEvent: SM.event(function (a, b, c) {
            calledB = true;
            a.should.equal(1);
            b.should.equal(2);
            c.should.equal(3);
          })
        }
      ]);
      var obj = new cl();

      obj.trigger('myEvent', 1, 2, 3);
      calledA.should.equal(true);
      calledB.should.equal(true);
    });

    it('should call the constructor function when instantiating an instance', function () {
      var called = false;
      var cl = SM.DefineClass([{
        constructor: function (arg1, arg2) {
          called = true;
          arg1.should.equal("test1");
          arg2.should.equal(2);
        }
      }]);

      var obj = new cl("test1", 2);
      called.should.equal(true);
    });

    it('should trigger an init event after the constructor', function () {
      var calledConstructor = false;
      var calledEvent = false;
      var cl = SM.DefineClass([{
        constructor: function (arg1, arg2) {
          calledEvent.should.equal(false);
          calledConstructor = true;
          arg1.should.equal("test1");
          arg2.should.equal(2);
        },
        init: SM.event(function (arg1, arg2) {
          calledConstructor.should.equal(true);
          calledEvent = true;
          arg1.should.equal("test1");
          arg2.should.equal(2);
        })
      }]);

      var obj = new cl("test1", 2);
      calledConstructor.should.equal(true);
      calledEvent.should.equal(true);
    });

    it('should detect when Constructors are passed as mixins and use them succesfully', function () {
      var called1 = false;
      var c1 = SM.DefineClass([{
        fn1: function () {
          called1 = true;
        }
      }]);

      var called2 = false;
      var c2 = SM.DefineClass([c1, {
        fn2: function () {
          called2 = true;
          this.fn1();
        }
      }]);

      var obj = new c2();
      obj.fn1.should.be.type("function");
      obj.fn2.should.be.type("function");
      obj.fn2();
      called1.should.equal(true);
      called2.should.equal(true);
    });

    it('should keep events of the same name across classes separate', function () {
      var base = SM.DefineClass([{
        init: SM.event(function () {

        })
      }]);

      var c1 = SM.DefineClass([base, {
        init: SM.event(function () {

        })
      }]);

      var c2 = SM.DefineClass([base, {
      }]);

      c1.prototype.init.length.should.equal(2);
      c2.prototype.init.length.should.equal(1);
    });
  });
});
