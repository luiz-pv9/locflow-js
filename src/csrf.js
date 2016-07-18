(function() {
  Locflow.Csrf = class Csrf {
    constructor(metaName, attrName) {
      this.metaName = metaName;
      this.attrName = attrName || metaName;
    }

    getFromMeta() {
      return Locflow.elm(`meta[name="${this.metaName}"]`).attr('content');
    }

    insertToken(obj) {
      let value = this.getFromMeta();
      if(value && obj) {
        obj[this.attrName] = value;
      }
    }
  };

  Locflow.csrf = new Locflow.Csrf('csrf_token');
})();
