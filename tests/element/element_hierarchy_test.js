describe('Locflow.Element hierarchy specs', () => {
  describe('#parent', () => {
  });

  describe('#append', () => {
    it('appends HTML to a single element', () => {
      let elm = Locflow.elm(`<div></div>`);
      let button = elm.append(`<button></button>`);
      expect(elm.query('button')).to.have.length(1);
      expect(elm.query('button')[0]).to.eq(button[0]);
    });

    it('appends HTML to the first element', () => {
      let elm = Locflow.elm(`
        <div class="one"></div>
        <div class="two"></div>
      `);
      let button = elm.append(`<button></button>`);
      expect(button).to.have.length(1);
      expect(elm.get(0).query('button')).to.have.length(1);
      expect(elm.get(1).query('button')).to.have.length(0);
    });

    it('appends multiple elements', () => {
      let elm = Locflow.elm(`<div></div>`);
      let buttons = Locflow.elm(`
        <button></button>
        <button></button>
      `);
      elm.append(buttons);
      expect(elm.query('button')).to.have.length(2);
    });

    it('appends an element to another element', () => {
      let elm = Locflow.elm(`<div></div>`);
      let button = Locflow.elm('<button></button>');
      elm.append(button);
      expect(elm.query('button')).to.have.length(1);
    });

    it('appends HTMLElement to an element', () => {
      let elm = Locflow.elm(`<div></div>`);
      let button = Locflow.elm('<button></button>')[0];
      elm.append(button);
      expect(elm.query('button')).to.have.length(1);
    });
  });

  describe('#remove', () => {
    it('removes the element', () => {
      let elm = Locflow.elm(`
        <div><button></button></div>
      `);
      let button = elm.query('button').remove();
      expect(button).to.have.length(1);
      expect(elm.query('button')).to.have.length(0);
    });

    it('removes multiple elements', () => {
      let elm = Locflow.elm(`
        <div>
          <button></button>
          <button></button>
        </div>
      `);
      let buttons = elm.query('button').remove();
      expect(buttons).to.have.length(2);
      expect(elm.query('button')).to.have.length(0);
    });
  });

  describe('#replaceWith', () => {
    it('removes the element', () => {
      let elm = Locflow.elm(`
        <div><button></button></div>
      `);
      let button = elm.query('button');
      button.replaceWith('<a></a>');
      expect(button[0].parentNode).not.to.be.ok;
    });

    it('inserts the given element', () => {
      let elm = Locflow.elm(`
        <div><button></button></div>
      `);
      let button = elm.query('button');
      let anchor = button.replaceWith('<a></a>');
      expect(anchor).to.have.length(1);
      expect(elm.query('a')).to.have.length(1);
    });
  });
});
