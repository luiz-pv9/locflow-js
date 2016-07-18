(function() {
  Locflow.era = Locflow.era || {};

  function queryHTMLElements(selector, root = document) {
    return root.querySelectorAll(selector);
  }

  function queryElements(selector, root = Locflow.era.element(document)) {
    let children = new Locflow.Element();
    root.eachNode(node => {
      let nodeChildren = queryHTMLElements(selector, node);
      for(let i = 0, len = nodeChildren.length; i < len; i++) {
        children.push(nodeChildren[i]);
      }
    });
    return children;
  }

  Locflow.era.queryElements = queryElements;
  Locflow.era.queryHTMLElements = queryHTMLElements;
  Locflow.era.initializeQuery = function(element) {
    element.query = function(selector) {
      return queryElements(selector, this);
    }
  };
})();
