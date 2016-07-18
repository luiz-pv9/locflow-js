describe('Era.element specs', () => {
  describe('HTML string', () => {
    it('returns a single HTML element', () => {
      let elm = Locflow.era.element('<div>Hello</div>');
      expect(elm).to.have.length(1);
      expect(elm[0].tagName).to.eq('DIV');
    });

    it('returns multiple HTML elements', () => {
      let elm = Locflow.era.element('<div>One</div><div>Two</div>');
      expect(elm).to.have.length(2);
      expect(elm[0].innerHTML).to.eq('One');
      expect(elm[1].innerHTML).to.eq('Two');
    });

    it('handles bad format HTML', () => {
      let elm = Locflow.era.element('<button>Hello</a>');
      expect(elm).to.have.length(1);
      expect(elm[0].tagName).to.eq('BUTTON');
    });
  });

  describe('HTMLElement', () => {
    it('initializes from html element', () => {
      let div = document.createElement('div');
      let elm = Locflow.era.element(div);
      expect(elm.length).to.eq(1);
    });
  });

  describe('#eachNode', () => {
    it('calls the callback with the raw node element', () => {
      let elm = Locflow.era.element('<div>One</div><div>Two</div>');
      let nodes = [];
      elm.eachNode(node => { nodes.push(node) });
      expect(nodes[0].innerHTML).to.eq('One');
      expect(nodes[1].innerHTML).to.eq('Two');
    });
  });

  describe('#merge', () => {
    it('merges nodes from both elements', () => {
      let elm1 = Locflow.elm(`<div class="one"></div>`);
      let elm2 = Locflow.elm(`<div class="two"></div>`);
      let merge = elm1.merge(elm2);
      expect(merge).to.have.length(2);
      expect(merge.get(0).hasClass('one')).to.be.true;
      expect(merge.get(1).hasClass('two')).to.be.true;
    });
  });

  describe('#html', () => {
    it('retunrs HTML string', () => {
      let elm = Locflow.elm('<div><i>foo</i></div>');
      expect(elm.html()).to.eq('<i>foo</i>');
    });
  });
});
