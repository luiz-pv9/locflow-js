describe('Locflow.Request specs', () => {
  let xhr, requests;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = (req) => { requests.push(req); };
    requests = [];
  });

  describe('#send', () => {
    it('sends the request', () => {
      let req = new Locflow.Request('GET', '/home');
      req.send();
      expect(requests).to.have.length(1);
      req = requests[0];
      expect(req.url).to.eq('/home');
      expect(req.method).to.eq('GET');
      expect(req.requestHeaders['X-Locflow']).to.eq('true');
      expect(req.requestHeaders['Content-Type']).to.eq(
        'application/x-www-form-urlencoded'
      );
      expect(req.requestHeaders['Accept']).to.eq(
        'text/html, application/xhtml+xml, application/xml'
      );
    });

    it('calls success on 200', () => {
      let req = new Locflow.Request('GET', '/home');
      req.success(sinon.spy());
      req.send();
      requests[0].respond(200, {}, 'ok');
      expect(req.opts.success.called).to.be.true;
    });

    it('calls error on != 200', () => {
      let req = new Locflow.Request('GET', '/home');
      req.error(sinon.spy());
      req.send();
      requests[0].respond(500, {}, 'err');
      expect(req.opts.error.called).to.be.true;
    });

    it('calls timeout', (done) => {
      let req = new Locflow.Request('GET', '/home');
      req.timeoutMillis = 2;
      req.timeout(sinon.spy());
      req.send();
      setTimeout(() => {
        expect(req.opts.timeout.called).to.be.true;
        done();
      }, 3);
    });

    it('calls success after timeout', (done) => {
      let req = new Locflow.Request('GET', '/home');
      req.timeout(sinon.spy());
      req.success(sinon.spy());
      req.timeoutMillis = 2;
      req.send();
      setTimeout(() => {
        expect(req.opts.timeout.called).to.be.true;
        requests[0].respond(200, {}, 'ok');
        expect(req.opts.success.called).to.be.true;
        done();
      }, 3);
    });

    it('accept custom headers', () => {
      let req = new Locflow.Request('GET', '/home', {
        headers: {
          'MY-CUSTOM-HEADER': 'foo',
          'OTHER-HEADER': 'bar',
        }
      });
      req.send();
      expect(requests[0].requestHeaders['MY-CUSTOM-HEADER']).to.eq('foo');
      expect(requests[0].requestHeaders['OTHER-HEADER']).to.eq('bar');
    });

    it('sends body data', () => {
      let req = new Locflow.Request('POST', '/home');
      req.send({hello: 'world', age: 10});
      expect(requests[0].requestBody).to.eq('hello=world&age=10');
    });

    it('inserts csrf token', () => {
      let token = Locflow.elm(document.head).append(`
        <meta name="csrf_token" content="123456" />
      `);
      let req = new Locflow.Request('POST', '/home');
      req.send({});
      expect(requests[0].requestBody).to.eq('csrf_token=123456');
      token.remove();
    });

    it('ignores csrf token if GET', () => {
      let token = Locflow.elm(document.head).append(`
        <meta name="csrf_token" content="123456" />
      `);
      let req = new Locflow.Request('GET', '/home');
      req.send();
      expect(requests[0].requestBody).to.be.null;
      token.remove();
    });
  });

  describe('#parseResponse', () => {
    it('parses json', () => {
      let req = new Locflow.Request('GET', '/home');
      req.send();
      requests[0].respond(200, {'Content-Type': 'application/json'}, 
        '{"hello":"world"}');
      expect(req.parseResponse()).to.deep.eql({hello: 'world'});
    });

    it('evaluates javascript', () => {
      window.__testCallback = sinon.spy();
      let req = new Locflow.Request('GET', '/home');
      req.send();
      requests[0].respond(200, {'Content-Type': 'text/javascript'}, 
        '__testCallback()');
      expect(window.__testCallback.called).to.be.true;
    });
  });

  describe('#abort', () => {
    it('doesnt trigger timeout', (done) => {
      let req = new Locflow.Request('GET', '/home');
      req.timeoutMillis = 2;
      req.timeout(sinon.spy());
      req.send();
      req.abort();
      setTimeout(() => {
        expect(req.opts.timeout.called).to.be.false;
        done();
      }, 3);
    });
  });
});
