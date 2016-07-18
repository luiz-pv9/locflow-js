(function() {
  Locflow.Navigation = class Navigation {
    onVisit(visit, cache) {
      if(visit.action !== 'restore') {
        visit.sendRequest();
      }
    }

    onLeave(visit, cache) {
      if(Locflow.snapshot != null) {
        Locflow.snapshot.stage(visit.url.toString(), document.title);
      }
    }

    restore(visit, cache) {
      if(Locflow.snapshot != null) {
        if(Locflow.snapshot.cache.has(visit.url.toString())) {
          Locflow.snapshot.render(visit.url.toString());
        } else {
          visit.sendRequest();
        }
      }
    }
  };
})();
