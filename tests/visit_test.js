describe('Locflow.Visit specs', () => {
  let xhr, requests;

  beforeEach(() => {
    Locflow.router.removeAll();
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = req => { requests.push(req); };
    requests = [];
  });

  it('has a default state of initialized', () => {
    let visit = new Locflow.Visit('/home');
    expect(visit.state).to.eq('initialized');
  });

  describe('#start', () => {
    it('updates state to `started`', () => {
      let visit = new Locflow.Visit('/home');
      visit.start();
      expect(visit.stateHistory).to.include('started');
    });

    it('calls onVisit from the match route', () => {
      Locflow.router.register('/home', {
        onVisit: visit => { visit.goingTo = 'home'; }
      });
      let visit = new Locflow.Visit('/home');
      visit.start();
      expect(visit.goingTo).to.eq('home');
    });

    it('tracks timing', () => {
      let visit = new Locflow.Visit('/home');
      expect(visit.timing.started).not.to.be.ok;
      visit.start();
      expect(visit.timing.started).to.be.ok;
    });
  });

  describe('#restore', () => {
    it('invokes restore in the route', () => {
      Locflow.router.register('/home', {
        restore: visit => { visit.restoringIn = 'home'; }
      });
      visit = new Locflow.Visit('/home');
      visit.restore();
      expect(visit.restoringIn).to.eq('home');
    });

    it('updates state to restored', () => {
      let visit = new Locflow.Visit('/home');
      visit.restore();
      expect(visit.stateHistory).to.include('restored');
    });
  });

  describe('#loadCachedSnapshot', () => {
    it('updates current body with cached body', () => {
      let visit = new Locflow.Visit('/home');
      let body = Locflow.elm(`
        <body><h1 id="my-title">My title</h1></body>
      `)[0];
      Locflow.snapshot.cache.put(visit.url.toString(), { body });
      visit.loadCachedSnapshot();
      expect(Locflow.elm('#my-title')).to.have.length(1);
      expect(Locflow.elm('#my-title').html()).to.eq('My title');
    });
  });

  describe('#sendRequest', () => {
    it('sends a GET request', () => {
      let visit = new Locflow.Visit('/home');
      visit.sendRequest();
      expect(requests).to.have.length(1);
      expect(requests[0].url).to.eq('/home');
      expect(requests[0].method).to.eq('GET');
    });

    it('stores the response and status', () => {
      let visit = new Locflow.Visit('/home');
      visit.sendRequest();
      requests[0].respond(200, {}, 'ok');
      expect(visit.requestResponse).to.eq('ok');
      expect(visit.requestStatus).to.eq(200);
    });

    it('calls visitRequestCompleted', () => {
      let visit = new Locflow.Visit('/home');
      visit.sendRequest();
      sinon.spy(Locflow.adapter, 'visitRequestCompleted');
      requests[0].respond(200, {}, 'ok');
      expect(Locflow.adapter.visitRequestCompleted.called).to.be.true;
    });

    it('calls visitRequestFailedWithStatusCode', () => {
      let visit = new Locflow.Visit('/home');
      visit.sendRequest();
      sinon.spy(Locflow.adapter, 'visitRequestFailedWithStatusCode');
      requests[0].respond(500, {}, 'err');
      expect(Locflow.adapter.visitRequestFailedWithStatusCode.called).to.be.true;
    });

    it('calls visitRequestTimeout', (done) => {
      let visit = new Locflow.Visit('/home');
      visit.timeoutMillis = 2;
      sinon.spy(Locflow.adapter, 'visitRequestTimeout');
      visit.sendRequest();
      setTimeout(() => {
        expect(Locflow.adapter.visitRequestTimeout.called).to.be.true;
        done();
      }, 3);
    });
  });

  describe('#render', () => {
    it('renders the HTML response', () => {
      let visit = new Locflow.Visit('/home');
      visit.requestResponse = `
        <html>
          <head><title>my-title</title></head>
          <body><div id="my-element">ok</div></body>
        </html>
      `;
      visit.requestStatus = 200;
      visit.render();
      expect(document.title).to.eq('my-title');
      expect(Locflow.elm('#my-element')).to.have.length(1);
    });
  
    it('calls visitRequestFinished in the adapter', () => {
      let visit = new Locflow.Visit('/home');
      visit.requestResponse = `
        <html>
          <head><title>my-title</title></head>
          <body><div id="my-element">ok</div></body>
        </html>
      `;
      visit.requestStatus = 200;
      sinon.spy(Locflow.adapter, 'visitRequestFinished');
      visit.render();
      expect(Locflow.adapter.visitRequestFinished.called).to.be.true;
    });
  });
});
