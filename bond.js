/*
 * Bond.js
 * Simple two-way data binding library for the browser
 *
 * Author: Thameera Senanayaka
 */

;(function(window, define) {

  var boundVals = {};
  var ATTR_NAME = 'data-bond';

  var Bond = function(varName, initialValue) {

    // Duplicate check
    if (boundVals[varName]) {
      console.warn('Bond: Duplicate name detected: ' + varName);
    }

    boundVals[varName] = 1;

    var newBond = (function() {
      var __val = null;
      var observers = [];

      // Updates all DOM elements bound to the current Bond
      var updateDOM = function(val) {
        observers.forEach(function(obs) {
          if (obs.tagName === 'INPUT') {
            obs.value = __val;
          } else {
            obs.innerHTML = __val;
          }
        });
      };

      // Bond object
      var obj = {
        get: function() {
          return __val;
        },
        set: function(val) {
          __val = val;
          updateDOM();
        }
      };

      // Find DOM elements bound to current bond ("observers")
      var elements = document.querySelectorAll('[' + ATTR_NAME + '="' + varName + '"]');
      for (var i = 0; i < elements.length; i++) {
        // Attach event listers to input elements
        if (elements[i].tagName === 'INPUT') {
          elements[i].addEventListener('input', function(e) {
            obj.set(e.target.value);
          });
        }
        observers.push(elements[i]);
      }

      // Set the optional initial value
      obj.set(initialValue);

      // Make the attributes unmodifiable
      Object.freeze(obj);

      return obj;
    })();

    return newBond;
  };

  // Expose to AMD, CommonJS or as a global
  if (typeof define === 'function' && define.amd !== undefined) {
    define(function () {
      return Bond;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bond;
  } else {
    window.Bond = Bond;
  }

})(this, this.define);

