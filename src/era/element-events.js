(function() {
  function registerEventBindOnElement(elm, eventName, callback) {
    let binds = elm.__eventBinds = elm.__eventBinds || {};
    let callbacks = binds[eventName] = binds[eventName] || [];
    callbacks.push(callback);
  };

  function removeEventBindFromElement(elm, eventName, callback) {
    let binds = elm.__eventBinds = elm.__eventBinds || {};
    let callbacks = binds[eventName] = binds[eventName] || [];

    if(callback) {
      elm.removeEventListener(eventName, callback);
    } else {
      callbacks.forEach(callback => {
        elm.removeEventListener(eventName, callback);
      })
    }

    let callbackIndex = callbacks.indexOf(callback);
    if(callbackIndex !== -1) {
      callbacks.splice(callbackIndex, 1);
    }
  };

  Locflow.era = Locflow.era || {};
  Locflow.era.initializeEvents = function(element) {
    element.on = function(eventName, callback) {
      return this.eachNode(node => {
        registerEventBindOnElement(node, eventName, callback);
        node.addEventListener(eventName, callback);
      });
    };

    element.off = function(eventName, callback) {
      return this.eachNode(node => {
        removeEventBindFromElement(node, eventName, callback);
      })
    };

    element.trigger = function(eventName, options) {
      let event = new CustomEvent(eventName, options);
      return this.eachNode(node => {
        node.dispatchEvent(event);
      })
    };
  };
})();
