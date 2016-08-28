define(function(require) {
  'use strict';

  var bdd = require('intern!bdd');
  var expect = require('intern/chai!expect');
  var customFixture = require('../helper/fixtures/custom.fixture');
  var whenFocusable = require('ally/when/focusable');

  bdd.describe('when/focusable', function() {
    var fixture;
    var handle;

    bdd.beforeEach(function() {
      fixture = customFixture([
        /*eslint-disable indent */
        '<div id="outer">',
          '<div id="inner">',
            '<input type="text" id="target">',
          '</div>',
        '</div>',
        /*eslint-enable indent */
      ]);

      fixture.outer = document.getElementById('outer');
      fixture.inner = document.getElementById('inner');
      fixture.target = document.getElementById('target');

      // move target out of view by making the parent scrollable
      var reset = 'box-sizing: border-box; margin:0; padding:0; border:0;';
      fixture.outer.setAttribute('style', reset + ' width: 200px; height: 50px; overflow: hidden;');
      fixture.inner.setAttribute('style', reset + ' width: 1000px; height: 50px; padding-left: 200px;');
      fixture.target.setAttribute('style', reset + ' width: 200px; height: 50px;');
      fixture.outer.scrollLeft = 0;
    });

    bdd.afterEach(function() {
      handle && handle.disengage({ force: true });
      fixture.remove();
      fixture = null;
    });

    bdd.it('should handle invalid input', function() {
      expect(function() {
        handle = whenFocusable();
        handle.disengage();
      }).to.throw(TypeError, 'when/focusable requires options.callback to be a function');

      expect(function() {
        handle = whenFocusable({
          context: document.body,
        });
        handle.disengage();
      }).to.throw(TypeError, 'when/focusable requires options.callback to be a function');

      expect(function() {
        handle = whenFocusable({
          callback: function() {},
        });
        handle.disengage();
      }).to.throw(TypeError, 'when/focusable requires valid options.context');
    });

    bdd.it('should handle initially visible elements asynchronously', function() {
      var deferred = this.async(10000);

      // scroll to 100% visibility
      fixture.outer.scrollLeft = 200;

      var synchronouslySet = false;
      handle = whenFocusable({
        context: '#target',
        callback: deferred.callback(function() {
          expect(synchronouslySet).to.equal(true, 'callback invoked async');
        }),
      });

      synchronouslySet = true;
    });

    bdd.it('should execute the callback when the element is visible 100%', function() {
      var deferred = this.async(10000);

      handle = whenFocusable({
        context: '#target',
        callback: deferred.callback(function() {
          expect(fixture.outer.scrollLeft).to.equal(200);
        }),
      });

      // scroll to 75% visibility
      fixture.outer.scrollLeft = 150;

      setTimeout(function() {
        // scroll to 100% visibility
        fixture.outer.scrollLeft = 200;
      }, 50);
    });

    bdd.it('should execute the callback when the element is visible 50%', function() {
      var deferred = this.async(10000);

      handle = whenFocusable({
        context: '#target',
        area: 0.5,
        callback: deferred.callback(function() {
          expect(fixture.outer.scrollLeft).to.equal(100);
        }),
      });

      // scroll to 25% visibility
      fixture.outer.scrollLeft = 50;

      setTimeout(function() {
        // scroll to 50% visibility
        fixture.outer.scrollLeft = 100;
      }, 50);
    });

    bdd.it('should allow to re-execute the callback', function() {
      var deferred = this.async(10000);
      var counter = 3;

      handle = whenFocusable({
        context: '#target',
        callback: deferred.rejectOnError(function() {
          expect(fixture.outer.scrollLeft).to.equal(200);

          counter--;
          if (counter) {
            return false;
          }

          deferred.resolve();
          return true;
        }),
      });

      // scroll to 75% visibility
      fixture.outer.scrollLeft = 150;

      setTimeout(function() {
        // scroll to 100% visibility
        fixture.outer.scrollLeft = 200;
      }, 50);
    });

    bdd.it('should ceize operation on .disengage()', function() {
      var deferred = this.async(10000);

      handle = whenFocusable({
        context: '#target',
        callback: deferred.rejectOnError(function() {
          throw new Error('should have been aborted');
        }),
      });

      // scroll to 75% visibility
      fixture.outer.scrollLeft = 150;

      handle.disengage();

      // scroll to 100% visibility
      fixture.outer.scrollLeft = 200;

      setTimeout(function() {
        deferred.resolve();
      }, 200);
    });

    bdd.it('should wait until the element is focusable', function() {
      var deferred = this.async(10000);

      // scroll to 100% visibility
      fixture.outer.scrollLeft = 200;
      fixture.target.disabled = true;

      handle = whenFocusable({
        context: '#target',
        callback: deferred.callback(function() {
          expect(fixture.target.disabled).to.equal(false);
          expect(fixture.outer.scrollLeft).to.equal(200);
        }),
      });

      setTimeout(function() {
        fixture.target.disabled = false;
      }, 50);
    });

  });
});
