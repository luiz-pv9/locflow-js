(function() {
  Locflow.Adapter = Locflow.Adapter || {};
  Locflow.Adapter.Browser = class Browser {
    constructor() {
      this.progressBar = new Locflow.ProgressBar();
    }

    visitProposed(visit) {
      visit.start();
    }

    visitRequestStarted(visit) {
      visit.changeHistory();
      if(visit.action === 'restore') {
        visit.restore();
      } else {
        visit.loadCachedSnapshot();
      }
      this.progressBar.setValue(0);
      this.progressBar.show();
    }

    visitRequestProgressed(value) {
      this.progressBar.setValue(value);
    }

    visitRequestCompleted(visit) {
      visit.render();
    }

    visitRequestFinished(visit) {
      this.progressBar.setValue(100);
      setTimeout(() => {
        this.progressBar.hide();
      }, 50);
      visit.callHandlersIfNotRestore();
    }

    visitRequestFailedWithStatusCode(visit) {
      console.log('Visit Failed');
    }

    visitRequestTimeout(visit) {
      if(window.onVisitTimeout != null) {
        window.onVisitTimeout(visit);
      }
    }
  };
  
})();
