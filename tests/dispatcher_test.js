describe('Locflow.Dispatcher specs', () => {
  let dispatcher, $document;
  beforeEach(() => {
    dispatcher = new Locflow.Dispatcher();
    $document = Locflow.elm(document);
  });

  afterEach(() => {
    $document.off('locflow:test');
  });

  describe('#dispatch', () => {
    it('invokes the event on document', (done) => {
      $document.on('locflow:test', () => {
        done();
      });
      dispatcher.dispatch('test');
    });

    it('binds events using era', (done) => {
      $document.on('locflow:test', () => {
        done();
      });
      dispatcher.dispatch('test');
    });

    it('uses the given data', (done) => {
      $document.on('locflow:test', (ev) => {
        expect(ev.data).to.deep.eql({hello: 'world'});
        done();
      });
      dispatcher.dispatch('test', {data: {hello: 'world'}});
    });

    it('is cancelable', () => {
      let callback = sinon.spy((ev) => { ev.preventDefault(); });
      $document.on('locflow:test', callback);
      let ev = dispatcher.dispatch('test');
      expect(callback.called).to.be.true;
      expect(ev.defaultPrevented).to.be.true;
    });
  });

  describe('#dispatchOn', () => {
    // TODO
  });
});
