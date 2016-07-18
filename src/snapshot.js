(function() {
  Locflow.Snapshot = class Snapshot {
    constructor() {
      this.cache = new Locflow.Cache();
      this.renderer = Locflow.renderer;
    }

    stage(path, title) {
      this.staged = { path, title };
    }

    cacheStagedBody(body, scrollX, scrollY) {
      if(this.staged) {
        this.cache.put(this.staged.path, {
          body, scrollX, scrollY, title: this.staged.title
        });
      }
    }

    render(url) {
      let record = this.cache.get(url);
      if(record) {
        this.renderer.replaceAndCacheStagedBody(record.body);
        this.renderer.scrollTo(record.scrollX, record.scrollY);
        this.renderer.updateTitle(record.title);
      }
    }
  };

  Locflow.snapshot = new Locflow.Snapshot();
})();
