(function() {
  const defaultVisitTimeoutMillis = 4000;

  Locflow.Visit = class Visit {
    constructor(url, opts = { action: 'advance' }) {
      this.url = url;
      this.opts = opts;
      this.action = opts.action;
      this.state = 'initialized';
      this.stateHistory = [this.state];
      this.timing = {};
    }

    setState(state) {
      this.stateHistory.push(state);
      this.timing[state] = new Date().getTime();
      this.state = state;
    }

    propose() {
      this.setState('proposed');
      if(Locflow.adapter != null) {
        Locflow.adapter.visitProposed(this);
      }
    }

    restore() {
      this.setState('restored');
      Locflow.router.restore(this);
    }

    loadCachedSnapshot() {
      Locflow.snapshot.render(this.url.toString());
    }

    start() { 
      this.setState('started');
      Locflow.router.invokeVisit(this);
      if(Locflow.adapter != null) {
        Locflow.adapter.visitRequestStarted(this);
      }
    }

    callHandlersIfNotRestore() {
      if(this.action !== 'restore') {
        this.callHandlers();
      }
    }

    callHandlers() {
      if(Locflow.handler != null) {
        Locflow.handler.call(this.url);
      }
    }

    render() {
      Locflow.renderer.render(this.requestResponse);
      this.finish();
    }

    finish() {
      if(Locflow.adapter != null) {
        Locflow.adapter.visitRequestFinished(this);
      }
    }

    progress(value) {
      if(Locflow.adapter != null) {
        Locflow.adapter.visitRequestProgressed(value);
      }
    }

    sendRequest() {
      this.request = Locflow.Request.GET(this.url, {
        success: this.onRequestSuccess.bind(this),
        error: this.onRequestError.bind(this),
        timeout: this.onRequestTimeout.bind(this),
        timeoutMillis: this.timeoutMillis || defaultVisitTimeoutMillis,
      });
    }

    onRequestSuccess(response, status, xhr) {
      this.requestResponse = response;
      this.requestStatus = status;
      if(Locflow.adapter != null) {
        Locflow.adapter.visitRequestCompleted(this);
      }
    }

    onRequestError(response, status, xhr) {
      this.requestResponse = response;
      this.requestStatus = status;
      if(Locflow.adapter != null) {
        Locflow.adapter.visitRequestFailedWithStatusCode(this);
      }
    }

    onRequestTimeout() {
      if(Locflow.adapter != null) {
        Locflow.adapter.visitRequestTimeout(this);
      }
    }

    changeHistory() {
      if(this.action === 'advance') {
        this.advanceHistory();
      } else if(this.action === 'replace') {
        this.replaceHistory();
      }
    }

    advanceHistory() {
      window.history.pushState({locflow: true}, null, this.url);
    }

    replaceHistory() {
      window.history.replaceState({locflow: true}, null, this.url);
    }
  };
})();
