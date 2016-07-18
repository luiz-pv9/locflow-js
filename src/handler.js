(function() {
  Locflow.Handler = class Handler {
    constructor() {
      this.handlers = [];
    }

    match(path, callback) {
      let url = new Locflow.Url(path);
      this.handlers.push({ url, callback });
    }

    sameMatchRule(handler1, handler2) {
      return handler1.url.path === handler2.url.path &&
             handler1.url.hash === handler2.url.hash;
    }

    find(path) {
      let url = new Locflow.Url(path);
      let firstMatch = null;
      return this.handlers.filter(handler => {
        if(firstMatch) {
          return this.sameMatchRule(firstMatch, handler);
        }
        if(handler.url.match(url)) {
          firstMatch = handler;
          return true;
        }
      });
    }

    call(path) {
      this.find(path).forEach(handler => {
        handler.callback(handler.url.match(new Locflow.Url(path)));
      });
    }
  };
})();
