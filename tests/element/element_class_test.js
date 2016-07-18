describe('Locflow.Element class specs', () => {

  describe('#class', () => {
    it('returns the classes of the first element', () => {
      let elm = Locflow.era.element(`
        <div class="container main"></div>
      `);
      expect(elm.class()).to.eq('container main');
    });

    it('returns an empty string if element has no class', () => {
      let elm = Locflow.era.element(`
        <div>Hello</div>
      `);
      expect(elm.class()).to.eq('');
    })
  })

  describe('#hasClass', () => {
    it('returns true if element has one of the given class', () => {
      let elm = Locflow.era.element(`
        <div class="container main"></div>
      `);
      expect(elm.hasClass('container')).to.be.true;
      expect(elm.hasClass('main')).to.be.true;
    });

    it("returns false if the element hasn't the given class", () => {
      let elm = Locflow.era.element(`
        <div class="container main"></div>
      `);
      expect(elm.hasClass('row')).to.be.false;
      expect(elm.hasClass('CONTAINER')).to.be.false;
    })
  })

  describe('#addClass', () => {
    it('adds the class to the element', () => {
      let elm = Locflow.era.element(`
        <div class="container main"></div>
      `);
      expect(elm.addClass('row')).to.eq(elm);
      expect(elm.class()).to.eq('container main row');
      expect(elm.hasClass('row')).to.be.true;
    });

    it("doesn't add the same class twice", () => {
      let elm = Locflow.era.element(`
        <div class="container main"></div>
      `);
      elm.addClass('main');
      expect(elm.hasClass('main')).to.be.true;
      expect(elm.class()).to.eq('container main');
    });

    it('adds the class to all elements', () => {
      let elm = Locflow.elm(`
        <div></div>
        <div></div>
      `);
      elm.addClass('foo');
      expect(elm.get(0).hasClass('foo')).to.be.true;
      expect(elm.get(1).hasClass('foo')).to.be.true;
    });
  });


  describe('#removeClass', () => {
    it('removes the given class from the element', () => {
      let elm = Locflow.era.element(`
        <div class="container main"></div>
      `);
      expect(elm.removeClass('main')).to.eq(elm);
      expect(elm.hasClass('main')).to.be.false;
      expect(elm.class()).to.eq('container');
    });

    it('does nothing if the class is not present in the element', () => {
      let elm = Locflow.era.element(`
        <div class="container main"></div>
      `);
      elm.removeClass('row');
      expect(elm.class()).to.eq('container main');
    });

    it('removes class from all elements', () => {
      let elm = Locflow.elm(`
        <div class="foo"></div>
        <div class="foo"></div>
      `);
      elm.removeClass('foo');
      expect(elm.get(0).hasClass('foo')).to.be.false;
      expect(elm.get(1).hasClass('foo')).to.be.false;
    });
  });

  describe('#toggleClass', () => {
    it('removes the given class if present in the element', () => {
      let elm = Locflow.era.element(`
        <div class="container main"></div>
      `);
      expect(elm.toggleClass('container')).to.eq(elm);
      expect(elm.hasClass('container')).to.be.false;
    });

    it('adds the given class if not present in the element', () => {
      let elm = Locflow.era.element(`
        <div class="container main"></div>
      `);
      expect(elm.toggleClass('row')).to.eq(elm);
      expect(elm.class()).to.eq('container main row');
    });
  });
});
