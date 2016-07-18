describe('Locflow.Element query specs', () => {
  describe('#query', () => {
    let elm = null;
    beforeEach(() => {
      elm = Locflow.elm(`
        <div>
          <a class="foo" href="">Hello</div>
          <button class="foo"></button>
          <header id="header"></header>
        </div>
      `);
    });

    it('finds children elements with selector', () => {
      let children = elm.query('.foo');
      expect(children).to.have.length(2);
      expect(children[0].tagName).to.eq('A');
      expect(children[1].tagName).to.eq('BUTTON');
    });

    it('finds by tagname', () => {
      expect(elm.query('button')).to.have.length(1);
      expect(elm.query('header')).to.have.length(1);
      expect(elm.query('a')).to.have.length(1);
    });

    it('finds in each wrapper node', () => {
      let elm = Locflow.elm(`
        <div><button></button></div>
        <div><button></button></div>
      `);
      expect(elm.query('button')).to.have.length(2);
    });

    it('finds elements in the document body', () => {
      let div = document.createElement('div');
      div.id = 'my-div';
      document.body.appendChild(div);

      let elm = Locflow.elm('#my-div');
      expect(elm).to.have.length(1);
      expect(elm[0]).to.eq(div);

      document.body.removeChild(div);
    });
  });
});
