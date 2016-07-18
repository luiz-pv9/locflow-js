describe('Locflow.Handler specs', () => {
  let handler;
  beforeEach(() => {
    handler = new Locflow.Handler();
  });

  describe('#match', () => {
    it('single handler', () => {
      handler.match('/home', function() {});
      expect(handler.find('/home')).to.have.length(1);
      handler.match('/about', function() {});
      expect(handler.find('/about')).to.have.length(1);
    });

    it('multiple handlers', () => {
      handler.match('/home', function() {});
      handler.match('/home', function() {});
      expect(handler.find('/home')).to.have.length(2);
    });

    it('considers different by hash', () => {
      handler.match('/home#latest', function() {});
      handler.match('/home#newest', function() {});
      expect(handler.find('/home')).to.have.length(0);
      expect(handler.find('/home#latest')).to.have.length(1);
      expect(handler.find('/home#newest')).to.have.length(1);
    });
  });

  describe('#call', () => {
    it('calls the first matcher', () => {
      let callback1 = sinon.spy();
      let callback2 = sinon.spy();
      handler.match('/posts/:id', callback1);
      handler.match('/posts/10', callback2);

      handler.call('/posts/10');
      expect(callback1.called).to.be.true;
      expect(callback2.called).to.be.false;
    });

    it('calls multiple handlers', () => {
      let callback1 = sinon.spy();
      let callback2 = sinon.spy();
      handler.match('/posts/:id', callback1);
      handler.match('/posts/:id', callback2);

      handler.call('/posts/10');
      expect(callback1.called).to.be.true;
      expect(callback2.called).to.be.true;
    });

    it('sends matched arguments', (done) => {
      callback = (params) => {
        expect(params.user_id).to.eq('10');
        expect(params.id).to.eq('15');
        done();
      };
      handler.match('/users/:user_id#comment=:id', callback);
      handler.call('/users/10#comment=15');
    });
  });
});
