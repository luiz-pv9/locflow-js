(function() {
  const attributeObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      callAttributeMutation(mutation);
    });
  });

  function callAttributeMutation(mutation) {
    if(mutation.target && mutation.target.__observed) {
      let callbacks = mutation.target.__observed[mutation.attributeName];
      if(callbacks) {
        callbacks.forEach(callback => {
          callback(mutation.target.getAttribute(mutation.attributeName),
                   mutation.oldValue);
        });
      }
    }
  }

  function observeElement(elm) {
    return attributeObserver.observe(elm,
      { attributes: true, attributeOldValue: true }
    );
  }

  function registerObserveBindOnElement(elm, attr, callback) {
    let observed = elm.__observed = elm.__observed || {};
    let callbacks = observed[attr] = observed[attr] || [];
    callbacks.push(callback);
    observeElement(elm);
  }

  Locflow.era = Locflow.era || {};
  Locflow.era.initializeObserver = function(element) {
    element.observe = function(attr, callback) {
      return this.eachNode(node => {
        registerObserveBindOnElement(node, attr, callback);
      });
    }
  };
})()
