describe('Locflow.Interceptor specs', () => {
  let interceptor;
  beforeEach(function() {
    interceptor = new Locflow.Interceptor();
  });

  function createDiv() {
    return Locflow.era.element('<div></div>')[0];
  }

  function createAnchor() {
    return Locflow.era.element('<a></a>')[0];
  }

  describe('#shouldIgnore', function() {
    it('ignores if the element has data-locflow="false"', function() {
      let div = createDiv();
      div.setAttribute('data-locflow', 'false');
      expect(interceptor.shouldIgnore(div)).to.be.true;
    });

    it('ignores if one of the parents has data-locflow="false"', function() {
      let parent = createDiv();
      let child = createDiv();
      parent.appendChild(child);
      parent.setAttribute('data-locflow', 'false');
      expect(interceptor.shouldIgnore(child)).to.be.true;
    });

    it('accepts if element has data-locflow="true"', function() {
      let div = createDiv();
      div.setAttribute('data-locflow', 'true');
      expect(interceptor.shouldIgnore(div)).to.be.false;
    });

    it('accepts if element doesnt have data-locflow', function() {
      let div = createDiv();
      expect(interceptor.shouldIgnore(div)).to.be.false;
    });

    it('accepts if element has data-locflow="true" and parent data-locflow="false"', () => {
      let parent = createDiv();
      let child = createDiv();
      parent.appendChild(child);
      parent.setAttribute('data-locflow', 'false');
      child.setAttribute('data-locflow', 'true');

      expect(interceptor.shouldIgnore(child)).to.be.false;
    });

    it('accepts if parent has data-locflow="true" and grandparent data-locflow="false"', () => {
      let grandparent = createDiv();
      let parent = createDiv();
      let child = createDiv();

      grandparent.setAttribute('data-locflow', 'false');
      parent.setAttribute('data-locflow', 'true');
      parent.appendChild(child);
      grandparent.appendChild(parent);

      expect(interceptor.shouldIgnore(child)).to.be.false;
    });
  });

  describe('#onClick', () => {
    it('ignores elements other than anchors', () => {
      let elm = Locflow.elm(`
        <div class="parent">
          <div class="child"></div>
        </div>
      `);
      interceptor.intercept(elm[0]);
      elm.query('.child')[0].click();
      expect(interceptor.visit).to.be.undefined; // did not issue visit
    });

    it('ignores unless href attribute', () => {
      let elm = Locflow.elm(`<div><a></a></div>`);
      interceptor.intercept(elm[0]);
      elm.query('a')[0].click();
      expect(interceptor.visit).to.be.undefined;
    });

    it('detects clicks on elements inside anchors', () => {
      let elm = Locflow.elm(`
        <div>
          <a href="/home"><span>Foo</span></a>
        </div>
      `);
      interceptor.intercept(elm[0]);
      elm.query('span')[0].click();
      // expect(interceptor.visit).to.be.ok;
    });

    it('creates a visit and proposes it', () => {
      let elm = Locflow.elm(`
        <div>
          <a href="/home">Foo</a>
        </div>
      `);
      interceptor.intercept(elm[0]);
      elm.query('a')[0].click();
      expect(interceptor.visit).to.be.ok;
      expect(interceptor.visit.stateHistory).to.include('proposed');
    });
  });
});
