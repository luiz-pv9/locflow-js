(function() {
  Locflow.Interceptor = class Interceptor {
    intercept(elm) {
      elm.addEventListener('click', this.onClick.bind(this));
      elm.addEventListener('submit', this.onSubmit.bind(this));
    }

    shouldIgnore(elm) {
      if(this.getElementAction(elm) === 'accept') {
        return false;
      }
      if(this.getElementAction(elm) === 'ignore') {
        return true;
      }
      if(this.getParentAction(elm) === 'ignore') {
        return true;
      }
      return false;
    }

    getElementAction(elm) {
      let meta = elm && elm.getAttribute && elm.getAttribute('data-locflow');
      if(meta === 'false') return 'ignore';
      if(meta === 'true') return 'accept';
      return 'default';
    }

    getParentAction(elm) {
      let parent = elm.parentNode;
      while(parent) {
        let action = this.getElementAction(parent);
        if(action !== 'default') {
          return action;
        }
        parent = parent.parentNode;
      }
      return 'default';
    }

    hasParentAnchor(elm) {
      return this.getParentAnchor(elm) != null;
    }

    getParentAnchor(elm) {
      while(elm.parentNode) {
        if(elm.parentNode.tagName === 'A') {
          return elm.parentNode;
        }
        elm = elm.parentNode;
      }
    }

    onClick(ev) {
      let target = ev.target;
      if(target.tagName === 'A' && 
          target.href &&
          !this.shouldIgnore(target)
      ) {
        ev.preventDefault();
        this.proposeVisitFromAnchor(target);
      } else if (this.hasParentAnchor(target) && 
          !this.shouldIgnore(this.getParentAnchor(target))
      ) {
        ev.preventDefault();
        this.proposeVisitFromAnchor(this.getParentAnchor(target));
      }
    }

    proposeVisitFromAnchor(anchor) {
      let method = anchor.getAttribute('data-method') || 'GET';
      if(method.toUpperCase() === 'GET') {
        this.visit = new Locflow.Visit(anchor.href);
        this.visit.propose();
      }
    }

    onSubmit(ev) {
      let targetForm = ev.target;
      if(targetForm.getAttribute('data-locflow') === 'remote' &&
          !this.shouldIgnore(targetForm)
      ) {
        ev.preventDefault();
        let form = new Locflow.Form(targetForm);
        form.submit();
      }
    }
  };
})();
