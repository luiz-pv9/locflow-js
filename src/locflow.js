(function() {
  window.Locflow = {
    version: '2.0.1',
    supported: (function() {
      return history.pushState && requestAnimationFrame;
    })(),

    visit(path, opts) {
      let visit = new Locflow.Visit(path, opts);
      visit.propose();
      return visit;
    },

    submit(form) {
      form = new Locflow.Form(form);
      return form.submit();
    },

    match(path, callback) {
      Locflow.handler = Locflow.handler || new Locflow.Handler();
      Locflow.handler.match(path, callback);
    },

    route(path, callbacks) {
      Locflow.router = Locflow.router || new Locflow.Router();
      Locflow.router.register(path, callbacks);
    },

    useCsrfTokenFromMeta(metaName, attrName) {
      Locflow.csrf = new Locflow.Csrf(metaName, attrName);
    },

    initialize(sendInitialRequest = true) {
      Locflow.adapter = new Locflow.Adapter.Browser();
      Locflow.router = Locflow.router || new Locflow.Router();
      Locflow.handler = Locflow.handler || new Locflow.Handler();
      Locflow.interceptor = new Locflow.Interceptor();
      Locflow.interceptor.intercept(document.body.parentNode);
      if(sendInitialRequest) {
        let visit = new Locflow.Visit(new Locflow.Url(document.location));
        Locflow.router.invokeCustomRoute(visit);
        visit.callHandlers();
      }
    }
  };

  if(Locflow.supported) {
    window.addEventListener('popstate', ev => {
      let url = new Locflow.Url(document.location);
      let visit = new Locflow.Visit(url, {action: 'restore'});
      visit.propose();
    });

    window.addEventListener('load', () => {
      Locflow.initialize(true);
    });
  }
})();
