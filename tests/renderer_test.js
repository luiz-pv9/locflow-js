describe('Locflow.Renderer specs', () => {
  let renderer;
  beforeEach(() => {
    renderer = new Locflow.Renderer();
    Locflow.elm('.test').remove();
  });

  describe('#cloneBody', () => {
    it('clones document.body', () => {
      let clonedBody = renderer.cloneBody();
      expect(clonedBody).to.be.ok;
      expect(clonedBody).not.to.eq(document.body);
    });
  });

  describe('#findPermanentElements', () => {
    let elm0, elm1, elm2, elm3;
    beforeEach(() => {
      elm0 = Locflow.elm(document.body).append(`<div id="elm0" class="test"></div>`);
      elm1 = Locflow.elm(document.body).append(`<div id="elm1" class="test"></div>`);
      elm2 = Locflow.elm(document.body).append(`<div id="elm2" class="test"></div>`);
      elm3 = Locflow.elm(document.body).append(`<div id="elm3" class="test"></div>`);
    });

    it('find permanent elements', () => {
      elm0.data('locflow', 'permanent');
      elm1.data('locflow', 'permanent');
      let permanents = renderer.findPermanentElements();
      expect(permanents).to.have.length(2);
      expect(permanents[0]).to.eq(elm0[0]);
      expect(permanents[1]).to.eq(elm1[0]);
    });

    it('ignores shallow elements', () => {
      elm0.data('locflow', 'permanent');
      elm1.data('locflow', 'permanent');
      elm1.data('shallow', 'true');
      let permanents = renderer.findPermanentElements();
      expect(permanents).to.have.length(1);
      expect(permanents[0]).to.eq(elm0[0]);
    });

    it('throws error if id not found', () => {
      elm0.data('locflow', 'permanent');
      elm0.attr('id', '');
      let findPermanents = () => {
        renderer.findPermanentElements();
      };
      expect(findPermanents).to.throw(/permanent element must have an id/);
    });
  });

  describe('#removePermanentElements', () => {
    let elm0, elm1;
    beforeEach(() => {
      elm0 = Locflow.elm(document.body).append(`
        <div id="elm0" class="test" data-locflow="permanent"></div>
      `);
      elm1 = Locflow.elm(document.body).append(`
        <div id="elm1" class="test" data-locflow="permanent"></div>
      `);
    });

    it('removes permanent elements', () => {
      let removed = renderer.removePermanentElements();
      expect(removed).to.have.length(2);
      expect(removed[0]).to.eq(elm0[0]);
      expect(removed[1]).to.eq(elm1[0]);
      expect(removed[0].parentNode).not.to.be.ok;
      expect(removed[1].parentNode).not.to.be.ok;
    });

    it('replaces with shallow copy', () => {
      renderer.removePermanentElements();
      let shallowElements = Locflow.elm('*[data-shallow]');
      expect(shallowElements).to.have.length(2);
      expect(shallowElements.get(0).attr('id')).to.eq('elm0');
      expect(shallowElements.get(1).attr('id')).to.eq('elm1');
      expect(renderer.findPermanentElements()).to.have.length(0);
    });
  });

  describe('#removeAndCachePermanentElements', () => {
    it('stores elements in the cache', () => {
      Locflow.elm(document.body).append(`
        <div class="test" id="elm0" data-locflow="permanent"></div>
      `);
      renderer.removeAndCachePermanentElements();
      expect(renderer.cache.get('elements')).to.have.length(1);
    });

    it('appends new elements', () => {
      Locflow.elm(document.body).append(`
        <div class="test" id="elm0" data-locflow="permanent"></div>
      `);
      renderer.removeAndCachePermanentElements();
      Locflow.elm(document.body).append(`
        <div class="test" id="elm1" data-locflow="permanent"></div>
      `);
      renderer.removeAndCachePermanentElements();
      expect(renderer.cache.get('elements')).to.have.length(2);
    });
  });

  describe('#mergePermanentElements', () => {
    let elm0, elm1;
    beforeEach(() => {
      elm0 = Locflow.elm(document.body).append(`
        <div id="elm0" class="test" data-locflow="permanent"></div>
      `);
      elm1 = Locflow.elm(document.body).append(`
        <div id="elm1" class="test" data-locflow="permanent"></div>
      `);
    });

    it('removes shallow placeholder', () => {
      let permanents = renderer.removePermanentElements();
      expect(renderer.findPermanentElements()).to.have.length(0);
      renderer.mergePermanentElements(permanents);
      expect(renderer.findPermanentElements()).to.have.length(2);
    });

    it('ignores if there is no placeholder for permanent', () => {
      let permanents = renderer.removePermanentElements();
      Locflow.elm('#elm0[data-shallow]').remove();
      renderer.mergePermanentElements(permanents);
      expect(renderer.findPermanentElements()).to.have.length(1);
    });
  });

  describe('#render', () => {
    it('updates document title', () => {
      renderer.render(`
        <html><head><title>new title</title></head></html>
      `);
      expect(document.title).to.eq('new title');
    });

    it('updates meta tags', () => {
      let meta = Locflow.elm(document.head).append(`
        <meta name="my-meta" content="my-content" />
      `);
      renderer.render(`
        <html>
          <head><meta name="my-meta" content="my-updated-content" /></head>
        </html>
      `);
      expect(meta.attr('content')).to.eq('my-updated-content');
      meta.remove();
    });

    it('inserts meta tags', () => {
      renderer.render(`
        <html>
          <head><meta name="my-new-meta" content="my-updated-content" /></head>
        </html>
      `);
      let meta = Locflow.elm('meta[name="my-new-meta"]');
      expect(meta).to.have.length(1);
      meta.remove();
    });

    it('replaces document body', () => {
      let currentBody = document.body;
      renderer.render(`
        <html>
          <body><h1 id="my-title">My new body</h1></body>
        </html>
      `);
      let h1 = Locflow.elm('#my-title');
      expect(h1.html()).to.eq('My new body');
    });

    it('merges permanent elements', () => {
      Locflow.elm(document.body).append(`
        <div class="test" id="elm0" data-locflow="permanent">my-content</div>
      `);
      renderer.removeAndCachePermanentElements();
      renderer.render(`
        <html>
          <body>
            <div id="elm0" data-locflow="permanent"></div>
          </body>
        </html>
      `);
      let elm = Locflow.elm('#elm0');
      expect(elm.html()).to.eq('my-content');
    });
  });
});
