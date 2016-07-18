(function() { 
  Locflow.era = Locflow.era || {};
  Locflow.era.initializeAttributes = function(element) {

    element.attr = function(attr, value) {
      if(value != null) {
        return this.eachNode(node => {
          node.setAttribute(attr, value);
        });
      } else {
        return this[0] && this[0].getAttribute(attr);
      }
    };

    element.prop = function(prop) {
      return this[0] && this[0][prop];
    };

    element.data = function(attr, value) {
      return this.attr('data-' + attr, value);
    };
  };
})();
