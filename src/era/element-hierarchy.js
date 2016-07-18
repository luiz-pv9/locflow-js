(function() {
  Locflow.era = Locflow.era || {};
  Locflow.era.initializeHierarchy = function(element) {

    element.parent = function() {
      return this[0] && this[0].parentNode;
    };

    element.append = function(arg) {
      var argType = Locflow.era.argumentType(arg);
      if(argType == 'htmlelement') {
        let child = this[0].appendChild(arg);
        return Locflow.elm(child);
      } else if(argType == 'nodelist') {
        for(let i=0, len=arg.length; i < len; i++) {
          this.append(arg[i]);
        }
        return Locflow.elm(arg);
      } else if(argType == 'element') {
        arg.eachNode(node => { 
          this.append(node);
        });
        return arg;
      } else if(argType == 'html') {
        return this.append(Locflow.elm(arg));
      }
    };

    element.remove = function() {
      return this.eachNode(node => {
        if(node.parentNode != null) {
          node.parentNode.removeChild(node);
        }
      });
    };

    element.replaceWith = function(arg) {
      var argType = Locflow.era.argumentType(arg);
      if(argType == 'htmlelement') {
        let child = this[0].parentNode.replaceChild(arg, this[0]);
        return Locflow.elm(child);
      } else if(argType == 'nodelist') {
        return this.replaceWith(arg[0]);
      } else if(argType == 'element') {
        return this.replaceWith(arg[0]);
      } else if(argType == 'html') {
        let elm = Locflow.elm(arg);
        return this.replaceWith(elm[0]);
      }
    }
  };
})();
