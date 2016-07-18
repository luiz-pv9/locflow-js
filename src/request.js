(function() {
  Locflow.Request = class Request {
    constructor(method, url, opts = {}) {
      this.method = method;
      this.url = url;
      this.opts = opts;
      this.timeoutMillis = opts.timeoutMillis || 4000;
      this.xhr = null;
      this.aborted = false;
    }

    static GET(url, opts) {
      let req = new Request('GET', url, opts);
      return req.send();
    }

    static POST(url, data, opts) {
      let req = new Request('POST', url, opts);
      return req.send(data);
    }

    static PUT(url, data, opts) {
      let req = new Request('PUT', url, opts);
      return req.send(data);
    }

    static DELETE(url, opts) {
      let req = new Request('DELETE', url, opts);
      return req.send();
    }

    success(callback) {
      this.opts.success = callback;
    }

    error(callback) {
      this.opts.error = callback;
    }

    timeout(callback) {
      this.opts.timeout = callback;
    }

    abort() {
      this.aborted = true;
      if(this.xhr != null) {
        this.xhr.abort();
      }
    }

    isJsonResponse() {
      let contentType = this.xhr.getResponseHeader('Content-Type') || '';
      return contentType.indexOf('application/json') === 0;
    }

    isJavascriptResponse() {
      let contentType = this.xhr.getResponseHeader('Content-Type') || '';
      return contentType.indexOf('application/javascript') === 0 ||
        contentType.indexOf('text/javascript') === 0;
    }

    parseResponse() {
      if(this.parsedResponse != null) {
        return this.parsedResponse;
      }
      if(this.isJsonResponse()) {
        this.parsedResponse = JSON.parse(this.xhr.responseText);
      } else if(this.isJavascriptResponse()) {
        this.parsedResponse = this.xhr.responseText;
        try {
          eval(this.parsedResponse);
        } catch(e) {
          if(Locflow.handleInvalidJavascriptResponse != null) {
            Locflow.handleInvalidJavascriptResponse(this.xhr, this.parsedResponse);
          }
        }
      } else {
        this.parsedResponse = this.xhr.responseText;
      }
      return this.parsedResponse;
    }

    setAcceptHeader() {
      let format = new Locflow.Url(this.url).format();
      if(format === 'html') {
        this.xhr.setRequestHeader('Accept',
          'text/html, application/xhtml+xml, application/xml');
      } else if(format === 'json') {
        this.xhr.setRequestHeader('Accept',
          'application/json; charset=utf-8');
      }
    }

    setDefaultHeaders() {
      this.xhr.setRequestHeader('X-Locflow', 'true');
      this.xhr.setRequestHeader('Content-Type', 
          'application/x-www-form-urlencoded');
      if(Locflow.csrf.getFromMeta()) {
        this.xhr.setRequestHeader('X-CSRF-Token', Locflow.csrf.getFromMeta());
      }
      if(!this.opts.headers || !this.opts.headers['Accept']) {
        this.setAcceptHeader();
      }
    }

    trigger(action) {
      this.parseResponse();
      if(this.xhr && this.xhr.readyState > 0) {
        let callback = this.opts[action];
        if(callback) {
          callback(this.parsedResponse, this.xhr.status, this.xhr);
        }
      }
    }

    send(body = {}) {
      this.xhr = new XMLHttpRequest();
      this.xhr.open(this.method, this.url, true);
      this.setDefaultHeaders();
      Object.keys(this.opts.headers || {}).forEach(key => {
        this.xhr.setRequestHeader(key, this.opts.headers[key]);
      });
      this.xhr.withCredentials = true;
      this.xhrTimeout = setTimeout(() => {
        if(this.aborted) { return; }
        this.trigger('timeout');
      }, this.timeoutMillis);
      this.xhr.onerror = () => {
        this.trigger('error');
      };
      this.xhr.onreadystatechange = () => {
        if(this.aborted) { return; }
        if(this.xhr.readyState === 4) {
          clearTimeout(this.xhrTimeout);
          if(this.xhr.status === 200) {
            this.trigger('success');
          } else {
            this.trigger('error');
          }
        }
      };
      this.xhr.send(this.formatBody(body));
    }

    formatBody(body) {
      if(this.method === 'GET') { return ''; }
      if(body != null) {
        Locflow.csrf.insertToken(body);
      }
      return new Locflow.Encode.Json(body).toQueryString();
    }
  }
})();
