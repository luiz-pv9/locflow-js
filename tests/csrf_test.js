describe('Locflow.Csrf specs', () => {
  let csrf;
  beforeEach(() => {
    csrf = new Locflow.Csrf('csrf_token');
  });

  describe('#getFromMeta', () => {
    it('returns undefined if not found', () => {
      expect(csrf.getFromMeta()).to.be.undefined;
    });

    it('returns content from meta', () => {
      let token = Locflow.elm(document.head).append(`
        <meta name="csrf_token" content="123456" />
      `);
      expect(csrf.getFromMeta()).to.eq('123456');
      token.remove();
    });
  });

  describe('#insertToken', () => {
    it('does nothing if not found', () => {
      let obj = {};
      csrf.insertToken(obj);
      expect(obj).to.deep.eql({});
    });

    it('inserts token from meta', () => {
      let token = Locflow.elm(document.head).append(`
        <meta name="csrf_token" content="123456" />
      `);
      let obj = {};
      csrf.insertToken(obj);
      expect(obj).to.deep.eql({csrf_token: '123456'});
      token.remove();
    });
  });
});
