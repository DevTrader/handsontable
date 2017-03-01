import {
  proxy,
  throttle,
  throttleAfterHits,
  debounce,
  pipe,
  partial,
  curry,
  curryRight,
  isFunction,
} from 'handsontable/helpers/function';

describe('Function helper', function() {
  //
  // Handsontable.helper.proxy
  //
  describe('proxy', function() {
    it('should returns new function with corrected binded context', function() {
      var proxied = function(context) {
        return proxy(function() {
          return this;
        }, context)();
      };
      var object = {};
      var func = function() {};

      expect(proxied(1).valueOf()).toBe(1);
      expect(proxied('foo').valueOf()).toBe('foo');
      expect(proxied(func)).toBe(func);
    });
  });

  //
  // Handsontable.helper.throttle
  //
  describe('throttle', function() {
    it('should returns new function with applied throttling functionality', function(done) {
      var spy = jasmine.createSpy();
      var throttled = throttle(spy, 200);

      throttled();
      throttled();
      throttled();
      throttled();
      throttled();

      expect(spy.calls.count()).toBe(1);

      setTimeout(function() {
        throttled();
        throttled();

        expect(spy.calls.count()).toBe(1);
      }, 100);

      setTimeout(function() {
        throttled();
        throttled();
        throttled();
        throttled();

        expect(spy.calls.count()).toBe(3);

      }, 400);

      setTimeout(function() {
        expect(spy.calls.count()).toBe(4);
        done();
      }, 900);
    });
  });

  //
  // Handsontable.helper.throttleAfterHits
  //
  describe('throttleAfterHits', function() {
    it('should returns new function with applied throttling functionality', function(done) {
      var spy = jasmine.createSpy();
      var throttled = throttleAfterHits(spy, 200, 5);

      throttled();
      throttled();
      throttled();
      throttled();
      throttled();

      expect(spy.calls.count()).toBe(5);

      setTimeout(function() {
        throttled();
        throttled();

        expect(spy.calls.count()).toBe(6);
      }, 100);

      setTimeout(function() {
        throttled();
        throttled();
        throttled();
        throttled();

        expect(spy.calls.count()).toBe(8);
      }, 400);

      setTimeout(function() {
        expect(spy.calls.count()).toBe(9);
        done();
      }, 900);
    });
  });

  //
  // Handsontable.helper.debounce
  //
  describe('debounce', function() {
    it('should returns new function with applied debouncing functionality', function(done) {
      var spy = jasmine.createSpy();
      var debounced = debounce(spy, 200);

      debounced();
      debounced();
      debounced();
      debounced();
      debounced();

      expect(spy.calls.count()).toBe(0);

      setTimeout(function() {
        debounced();
        debounced();

        expect(spy.calls.count()).toBe(0);
      }, 100);

      setTimeout(function() {
        debounced();
        debounced();
        debounced();
        debounced();

        expect(spy.calls.count()).toBe(1);
      }, 400);

      setTimeout(function() {
        expect(spy.calls.count()).toBe(2);
        done();
      }, 900);
    });
  });

  //
  // Handsontable.helper.pipe
  //
  describe('pipe', function() {
    it('should returns new function with piped all passed functions', function() {
      var spy1 = jasmine.createSpyObj('spy', ['test1', 'test2', 'test3', 'test4']);

      spy1.test1.and.callFake((a) => a + 1);
      spy1.test2.and.callFake((a) => a + 1);
      spy1.test3.and.callFake((a) => a + 1);
      spy1.test4.and.callFake((a) => a + 1);

      var piped = pipe(spy1.test1, spy1.test2, spy1.test3, spy1.test4);

      var result = piped(1, 2, 'foo');

      expect(spy1.test1).toHaveBeenCalledWith(1, 2, 'foo');
      expect(spy1.test2).toHaveBeenCalledWith(2);
      expect(spy1.test3).toHaveBeenCalledWith(3);
      expect(spy1.test4).toHaveBeenCalledWith(4);
      expect(result).toBe(5);
    });
  });

  //
  // Handsontable.helper.partial
  //
  describe('partial', function() {
    it('should returns new function with cached arguments', function() {
      var spy1 = jasmine.createSpyObj('spy', ['test1', 'test2', 'test3', 'test4']);

      spy1.test1.and.callFake((a, b, c) => (a + b) + c);

      var partialized = partial(spy1.test1, 1, 2);

      expect(partialized('foo')).toBe('3foo');

      partialized = partial(spy1.test1);

      expect(partialized(1, 2, 'foo')).toBe('3foo');

      partialized = partial(spy1.test1, 1, 2, 3);

      expect(partialized('foo')).toBe(6);
    });
  });

  //
  // Handsontable.helper.curry
  //
  describe('curry', function() {
    it('should returns new function with cached arguments (collecting arguments from the left to the right)', function() {
      var fn = (a, b, c) => (a + b) + c;

      var curried = curry(fn);

      expect(curried(1, 2, 'foo')).toBe('3foo');
      expect(curried(1)(2)('foo')).toBe('3foo');
      expect(curried(1, 2)(3)).toBe(6);
    });
  });

  //
  // Handsontable.helper.curryRight
  //
  describe('curryRight', function() {
    it('should returns new function with cached arguments (collecting arguments from the right to the left)', function() {
      var fn = (a, b, c) => (a + b) + c;

      var curried = curryRight(fn);

      expect(curried('foo', 2, 1)).toBe('3foo');
      expect(curried(1, 2, 'foo')).toBe('foo21');
      expect(curried(1)(2)('foo')).toBe('3foo');
      expect(curried(1, 2)(3)).toBe(6);
    });
  });

  //
  // Handsontable.helper.isFunction
  //
  describe('isFunction', function() {
    it('should correctly detect function', function() {
      var toCheck = [
        function() {},
        {id: function() {}},
        1,
        'text',
        /^\d+$/,
        true
      ];

      function namedFunc() {}

      expect(isFunction(toCheck[0])).toBeTruthy();
      expect(isFunction(toCheck[1].id)).toBeTruthy();
      expect(isFunction(namedFunc)).toBeTruthy();
      expect(isFunction(function() {})).toBeTruthy();

      expect(isFunction(toCheck)).toBeFalsy();
      expect(isFunction(toCheck[1])).toBeFalsy();
      expect(isFunction(toCheck[2])).toBeFalsy();
      expect(isFunction(toCheck[3])).toBeFalsy();
      expect(isFunction(toCheck[4])).toBeFalsy();
      expect(isFunction(toCheck[5])).toBeFalsy();
    });
  });
});