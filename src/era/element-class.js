(function() {
  Locflow.era = Locflow.era || {};
  Locflow.era.initializeClass = function(element) {
    element.class = function() {
      return this[0].className;
    }

    element.hasClass = function(className) {
      return this.class().indexOf(className.trim()) !== -1;
    }

    element.addClass = function(className) {
      this.eachNode(node => {
        if(node.className.indexOf(className) === -1) {
          node.className = node.className + " " + className;
        }
      });
      return this;
    }

    element.removeClass = function(className) {
      this.eachNode(node => {
        node.className = node.className.replace(className, '').trim();
      });
      return this;
    }

    element.toggleClass = function(className) {
      if(this.hasClass(className)) {
        return this.removeClass(className);
      } else {
        return this.addClass(className);
      }
    }

  };
})();
