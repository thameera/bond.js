;(function(window) {

  var boundVals = {};
  var ATTR_NAME = 'data-bond';

  window.Bond = function(varName, initialValue) {

    if (boundVals[varName]) {
      console.warn('Bond: Duplicate name detected: ' + varName);
    }

    boundVals[varName] = (function() {
      var __val = null;
      var observers = [];

      var updateDOM = function(val) {
        observers.forEach(function(obs) {
          if (obs.tagName === 'INPUT') {
            obs.value = __val;
          } else {
            obs.innerHTML = __val;
          }
        });
      };

      var obj = {
        get: function() {
          return __val;
        },
        set: function(val) {
          __val = val;
          updateDOM();
        }
      };

      // Attach event listeners
      var elements = document.querySelectorAll('[' + ATTR_NAME + '="' + varName + '"]');
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].tagName === 'INPUT') {
          elements[i].addEventListener('input', function(e) {
            obj.set(e.target.value);
          });
        }
        observers.push(elements[i]);
      }

      obj.set(initialValue);

      Object.freeze(obj);

      return obj;
    })();

    return boundVals[varName];
  };

})(window);

