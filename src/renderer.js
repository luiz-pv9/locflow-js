(function() {
  Locflow.Renderer = class Renderer {
    constructor() {
      this.cache = new Locflow.Cache();
    }

    cloneBody() {
      return document.body.cloneNode(true);
    }

    findPermanentElements() {
      let permanents = Locflow.elm(`
        *[data-locflow="permanent"]:not([data-shallow])
      `);
      permanents.eachNode(node => {
        if(!node.id) {
          throw new Error('permanent element must have an id');
        }
      });
      return permanents;
    }

    removePermanentElements() {
      let permanents = this.findPermanentElements();
      permanents.forEach(node => {
        let shallowClone = node.cloneNode(false);
        shallowClone.setAttribute('data-shallow', 'true');
        node.parentNode.replaceChild(shallowClone, node);
      });
      return permanents;
    }

    removeAndCachePermanentElements() {
      let permanentElements = this.removePermanentElements();
      let currentPermanents = this.cache.get('elements') || [];
      let mergedPermanents = Array.prototype.slice.call(currentPermanents);
      for(let i = 0, len = permanentElements.length; i < len; i++) {
        let permanent = permanentElements[i];
        let found = false;
        for(let j = 0, len = currentPermanents.length; j < len; j++) {
          let currentPermanent = currentPermanents[j];
          if(permanent.id === currentPermanent.id) {
            found = true;
            break;
          }
        }
        if(!found) {
          mergedPermanents.push(permanent);
        }
      }
      this.cache.put('elements', mergedPermanents);
      return mergedPermanents;
    }

    mergePermanentElements(permanentElements) {
      for(let i = 0, len = permanentElements.length; i < len; i++) {
        let elm = permanentElements[i];
        let shallowPlaceholder = Locflow.elm(`#${elm.id}`);
        if(shallowPlaceholder.length > 0) {
          shallowPlaceholder.replaceWith(elm);
        }
      }
    }

    mergeCachedPermanentElements() {
      this.mergePermanentElements(this.cache.get('elements', []));
    }

    scrollTo(scrollX, scrollY) {
      return window.scrollTo(scrollX, scrollY);
    }

    extractHeadTags(html) {
      return Locflow.elm(html).query('head meta');
    }

    extractTitle(html) {
      let title = Locflow.elm(html).query('head title');
      return title.length ? title.html() : document.title;
    }

    updateTitle(title) {
      document.title = title;
    }

    mergeHeadTags(tags) {
      tags.forEach(meta => {
        if(!meta.name) { return; }
        let currentMeta = Locflow.elm(`meta[name="${meta.name}"]`);
        if(currentMeta.length) {
          currentMeta.attr('content', meta.content);
        } else {
          Locflow.elm(document.head).append(meta);
        }
      });
    }

    extractBody(html) {
      let body = html.getElementsByTagName('body');
      if(body.length === 1) {
        return body[0];
      } else {
        throw new Error("body tag not found in HTML");
      }
    }

    replaceAndCacheStagedBody(body) {
      let scrollX = window.pageXOffset;
      let scrollY = window.pageYOffset;
      this.removeAndCachePermanentElements();
      let stagedBody = document.body.parentNode.replaceChild(body, document.body);
      this.mergeCachedPermanentElements();
      Locflow.snapshot.cacheStagedBody(stagedBody, scrollX, scrollY);
    }

    render(string) {
      let el = document.createElement('html');
      el.innerHTML = string;
      this.updateTitle(this.extractTitle(el));
      this.mergeHeadTags(this.extractHeadTags(el));
      this.replaceAndCacheStagedBody(this.extractBody(el));
    }
  };

  Locflow.renderer = new Locflow.Renderer();
})();
