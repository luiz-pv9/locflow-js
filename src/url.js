(function() {
  Locflow.Url = class Url {
    constructor(url) {
      if(url instanceof Url) {
        this.copyFromUrl(url);
      } else if(url && url.host && url.pathname) {
        this.copyFromLocation(url);
      } else if('string' === typeof url) {
        this.initializeFromString(url);
      }
    }

    copyFromUrl(url) {
      this.protocol = url.protocol;
      this.domain = url.domain;
      this.query = url.query;
      this.path = url.path;
      this.port = url.port;
      this.hash = url.hash;
    }

    copyFromLocation(loc) {
      this.protocol = loc.protocol.replace(':', '');
      this.domain = loc.host;
      this.query = loc.search;
      this.path = loc.pathname;
      this.port = loc.port;
      this.hash = loc.hash;
      if(this.domain.indexOf(':') !== -1) {
        this.domain = this.domain.split(':')[0];
      }
    }

    initializeFromString(str) {
      let regex = /(file|http[s]?:\/\/)?([^\/?#]*)?([^?#]*)([^#]*)([\s\S]*)/i;
      let matches = str.toLowerCase().match(regex);
      if(matches) {
        this.protocol = (matches[1] || '').replace('://', '');
        this.domain = matches[2] || '';
        this.path = matches[3];
        this.query = matches[4];
        this.hash = matches[5];
        this.port = '';
        if(this.domain.indexOf(':') !== -1) {
          let parts = this.domain.split(':');
          this.domain = parts[0];
          this.port = parts[1];
        }
      }
    }

    toString() {
      let str = '';
      str += this.protocol ? this.protocol + '://' : document.location.protocol + '//';
      str += this.domain ? this.domain : document.location.host;
      str += this.port ? ':' + this.port : '';
      return str + (this.path || '/') + this.query + this.hash;
    }

    getQueryObject() {
      return new Locflow.Encode.QueryString(this.query).toJson();
    }

    setQueryObject(params) {
      this.query = '?' + new Locflow.Encode.Json(params).toQueryString();
    }

    withoutHash() {
      let hashless = new Url(this);
      hashless.hash = '';
      return hashless;
    }

    format() {
      if(this.path.indexOf('.json') === this.path.length - '.json'.length) {
        return 'json';
      } else if(this.path.indexOf('.js') === this.path.length - '.js'.length) {
        return 'js';
      } else {
        return 'html';
      }
    }

    splitPath() {
      return this.path.replace(/\/$/, '').split('/');
    }

    namedPathParams(other) {
      let namedParams = {};
      let pathParts = this.splitPath();
      let otherParts = other.splitPath();
      for(let index = 0; index < pathParts.length; index++) {
        let path = pathParts[index];
        let otherPath = otherParts[index];
        if(/^\:/.test(path)) {
          path = path.replace(/^\:/, '');
          if(namedParams[path]) {
            throw new Error(`url [${this.toString()}] has multiple named params [:${path}]`);
          }
          namedParams[path] = otherPath;
        } else if(path !== otherPath) {
          return false;
        }
      }
      return namedParams;
    }

    match(other) {
      let pathParams = this.matchPath(other);
      let hashParams = this.matchHash(other);
      if(!pathParams || !hashParams) {
        return false;
      }
      return Locflow.mergeObjects(pathParams, hashParams);
    }

    matchPath(other) {
      other = new Url(other);
      if(this.path === other.path) { return {}; }
      if(this.splitPath().length !== other.splitPath().length) { return false; }
      // `namedPathParams` may still return false.
      return this.namedPathParams(other);
    }

    // TODO: refactor
    matchHash(url) {
      if(!(url instanceof Url)) {
        url = new Url(url);
      }
      if(this.hash === url.hash) {
        return {};
      }
      let hashEncoding = new Locflow.Encode.QueryString(this.hash.replace('#', ''));
      let targetHashEncoding = new Locflow.Encode.QueryString(url.hash.replace('#', ''));
      if(!hashEncoding.isValid() || !targetHashEncoding.isValid()) {
        return false;
      }
      let hashQuery = hashEncoding.toJson();
      let targetHashQuery = targetHashEncoding.toJson();
      let namedParams = {};
      for(let key in hashQuery) {
        let attr = hashQuery[key];
        if(attr.indexOf(':') === 0) {
          if(!targetHashQuery[key]) {
            return false;
          }
          if(namedParams[attr.replace(':', '')] !== undefined) {
            throw new Error(`
              hash [${this.hash}] has multiple params [${attr}]
            `);
          }
          namedParams[attr.replace(':', '')] = targetHashQuery[key];
        } else {
          if(attr !== targetHashQuery[key]) {
            return false;
          }
        }
      }
      return namedParams;
    }
  };
})();
