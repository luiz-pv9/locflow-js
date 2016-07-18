(function() {

  const bodyRegex = /^<body[\s\S]*>[\s\S]*?<\/body>$/i;
  const headRegex = /^<head[\s\S]*>[\s\S]*?<\/head>$/i;

  function stringToElements(string) {
    if(bodyRegex.test(string.trim())) {
      let elm = document.createElement('html');
      elm.innerHTML = string;
      return elm.getElementsByTagName("body");
    } else if(headRegex.test(string.trim())) {
      let elm = document.createElement('html');
      elm.innerHTML = string;
      return elm.getElementsByTagName("head");
    } else {
      let elm = document.createElement('div');
      elm.innerHTML = string;
      return elm.childNodes;
    }
  }

  /**
   * There is a funny issue to work with here. The `Element` class accepts
   * any of the given arguments:
   *
   * - Selector  (string)
   * - HTML      (string)
   * - Node      (HTMLElement)
   * - NodeList  (NodeList)
   * - Element   (Locflow.Element)
   *
   * We can switch on `instanceof` for almost every argument, except the first
   * two. Since they're both strings, we need a way to decide whether the user
   * wants to wrap a piece of HTML or select existing elements in the page.
   * 
   * I couldn't find a definite answer, so we'll use the simplest implementation
   * possible, described as follows:
   *
   * ```
   * Does the given string contains the character '<'?
   *   Yes: It's HTML
   *   No:  It's a selector
   * ```
   */
  function argumentType(arg) {
    if(arg instanceof HTMLElement) { return 'htmlelement'; }
    if(arg instanceof NodeList) { return 'nodelist'; }
    if(arg instanceof Element) { return 'element'; }
    if(arg === window.document) { return 'document'; }
    if(typeof arg === 'string') {
      if(arg.indexOf('<') === -1) {
        return 'selector';
      } else {
        return 'html';
      }
    }
  }

  class Element extends Array {
    constructor(arg) {
      super();
      switch(argumentType(arg)) {
        case 'htmlelement':
          this.initializeFromHTMLElement(arg);
          break;
        case 'nodelist':
          this.initializeFromNodeList(arg);
          break;
        case 'element':
          this.initializeFromElement(arg);
          break;
        case 'document':
          this.initializeFromHTMLElement(arg);
          break;
        case 'html':
          this.initializeFromHtml(arg);
          break;
        case 'selector':
          this.initializeFromSelector(arg);
          break;
      }
      Locflow.era.initializeObserver(this);
      Locflow.era.initializeEvents(this);
      Locflow.era.initializeClass(this);
      Locflow.era.initializeAttributes(this);
      Locflow.era.initializeQuery(this);
      Locflow.era.initializeHierarchy(this);
    }

    initializeFromHtml(html) {
      let elements = stringToElements(html);
      for(var i = 0; i < elements.length; i++) {
        if(elements[i].tagName != null) {
          this.push(elements[i]);
        }
      }
    }

    initializeFromSelector(selector) {
      this.initializeFromNodeList(Locflow.era.queryHTMLElements(selector));
    }

    initializeFromElement(element) {
    }

    initializeFromNodeList(nodeList) {
      for(let i=0, len=nodeList.length; i < len; i++) {
        this.push(nodeList[i]);
      }
    }

    initializeFromHTMLElement(htmlElement) {
      this.push(htmlElement);
    }

    eachNode(callback) {
      this.forEach(callback);
      return this;
    }

    merge(elm) {
      let merged = Locflow.elm();
      this.eachNode(node => { merged.push(node); });
      elm.eachNode(node => { merged.push(node); });
      return merged;
    }

    html() {
      return this[0] ? this[0].innerHTML : '';
    }

    first() {
      return this.get(0);
    }

    get(n) {
      return Locflow.elm(this[n]);
    }
  }

  Locflow.Element = Element;
  Locflow.era.argumentType = argumentType;
  Locflow.elm = Locflow.era.element = window.elm = function(selector) {
    return new Element(selector);
  }

})();

