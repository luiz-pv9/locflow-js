describe('Locflow.Url specs', function() {
  describe('parsing', function() {

    it('parses from a string with every component', function() {
      let url = new Locflow.Url('https://outme.co:8000/my/path?name=foo#bar');
      expect(url.protocol).to.eq('https');
      expect(url.domain).to.eq('outme.co');
      expect(url.port).to.eq('8000');
      expect(url.path).to.eq('/my/path');
      expect(url.query).to.eq('?name=foo');
      expect(url.hash).to.eq('#bar');
    });

    it('parses from a string without port', function() {
      let url = new Locflow.Url('https://outme.co/my/path?name=foo#bar');
      expect(url.protocol).to.eq('https');
      expect(url.domain).to.eq('outme.co');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('/my/path');
      expect(url.query).to.eq('?name=foo');
      expect(url.hash).to.eq('#bar');
    });

    it('parses from a string without port and hash', function() {
      let url = new Locflow.Url('https://outme.co/my/path?name=foo');
      expect(url.protocol).to.eq('https');
      expect(url.domain).to.eq('outme.co');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('/my/path');
      expect(url.query).to.eq('?name=foo');
      expect(url.hash).to.eq('');
    });

    it('parses from a string without port, hash and query', function() {
      let url = new Locflow.Url('https://outme.co/my/path');
      expect(url.protocol).to.eq('https');
      expect(url.domain).to.eq('outme.co');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('/my/path');
      expect(url.query).to.eq('');
      expect(url.hash).to.eq('');
    });

    it('parses from a string without port, hash and path', function() {
      let url = new Locflow.Url('https://outme.co?name=foo');
      expect(url.protocol).to.eq('https');
      expect(url.domain).to.eq('outme.co');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('');
      expect(url.query).to.eq('?name=foo');
      expect(url.hash).to.eq('');
    });

    it('parses from a string without port, hash, query and path', function() {
      let url = new Locflow.Url('https://outme.co');
      expect(url.protocol).to.eq('https');
      expect(url.domain).to.eq('outme.co');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('');
      expect(url.query).to.eq('');
      expect(url.hash).to.eq('');
    });

    it('parses from a string without port, hash, query, path and protocol', function() {
      let url = new Locflow.Url('outme.co');
      expect(url.protocol).to.eq('');
      expect(url.domain).to.eq('outme.co');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('');
      expect(url.query).to.eq('');
      expect(url.hash).to.eq('');
    });

    it('parses from a string without port, domain, hash, query and protocol', function() {
      let url = new Locflow.Url('/posts/10');
      expect(url.protocol).to.eq('');
      expect(url.domain).to.eq('');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('/posts/10');
      expect(url.query).to.eq('');
      expect(url.hash).to.eq('');
    });

    it('parses from a string without port, domain, hash and protocol', function() {
      let url = new Locflow.Url('/posts/10?view=column');
      expect(url.protocol).to.eq('');
      expect(url.domain).to.eq('');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('/posts/10');
      expect(url.query).to.eq('?view=column');
      expect(url.hash).to.eq('');
    });

    it('parse path and hash only', function() {
      let url = new Locflow.Url('/posts#latest');
      expect(url.protocol).to.eq('');
      expect(url.domain).to.eq('');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('/posts');
      expect(url.query).to.eq('');
      expect(url.hash).to.eq('#latest');
    });

    it('parse only the hash part', function() {
      let url = new Locflow.Url('#latest');
      expect(url.protocol).to.eq('');
      expect(url.domain).to.eq('');
      expect(url.port).to.eq('');
      expect(url.path).to.eq('');
      expect(url.query).to.eq('');
      expect(url.hash).to.eq('#latest');
    });
  });

  describe('initializing from other urls', function() {
    it('copies all properties', () => {
      let url = new Locflow.Url('https://outme.co:3000/my/path?name=luiz#target');
      let other = new Locflow.Url(url);
      expect(url).not.to.eq(other);
      expect(url.protocol).to.eq(other.protocol);
      expect(url.domain).to.eq(other.domain);
      expect(url.port).to.eq(other.port);
      expect(url.path).to.eq(other.path);
      expect(url.query).to.eq(other.query);
      expect(url.hash).to.eq(other.hash);
    });
  });

  describe('query object', function() {
    it('returns an empty object if there is no query in the url', () => {
      let url = new Locflow.Url('outme.co/home');
      expect(url.getQueryObject()).to.deep.eql({});
    });

    it('encodes the url using the Locflow.Encoding.QueryString class', function() {
      let url = new Locflow.Url('outme.co/home?name=luiz');
      expect(url.getQueryObject()).to.deep.eql({
        name: 'luiz'
      });
    });

    it('encodes the given object and assigns to query', function() {
      let url = new Locflow.Url('outme.co/home');
      url.setQueryObject({ name: 'luiz' });
      expect(url.query).to.eql('?name=luiz');
    });
  });

  describe('#withoutHash', function() {
    it('retunrs a new url without the hash value', function() {
      let url = new Locflow.Url('outme.co/home#target');
      let hashless = url.withoutHash();
      expect(url).not.to.eq(hashless);
      expect(url.hash).to.eq('#target');
      expect(hashless.hash).to.eq('');
    });
  });

  describe('#matchPath', function() {
    let testCases = [
      ['/posts', '/posts', {}], 
      ['/users/10', '/users/10', {}], 
      ['/users/:id', '/users/10', { id: '10' }], 
      ['/users/:id/edit', '/users/10/edit', { id: '10' }], 
      ['/users/:id/edit', '/users//edit', { id: '' }], 
      ['/users/:id/edit', '/users/edit', false], 
      ['/users/:user_id/comments/:id', '/users/10/comments/5', { user_id: '10', id: '5' }],
      ['/posts', '/POSTS', {}], 
      ['/posts', '/postz', false], 
      ['/users/:id', '/users', false], 
      ['/posts/latest', '/posts/latest/', {}], 
      ['/posts#latest', '/posts#latest', {}]
    ];

    it('assets the test cases works', function() {
      for (i = 0, len = testCases.length; i < len; i++) {
        let testCase = testCases[i];
        let url1 = new Locflow.Url(testCase[0]);
        let url2 = new Locflow.Url(testCase[1]);
        let errorMessage = (url1.toString()) + "\n" + (url2.toString()) + "\nshould match";
        expect(url1.matchPath(url2), errorMessage).to.eql(testCase[2]);
      }
    });

    it('throws an error if two placeholders have the same name', function() {
      let url1 = new Locflow.Url('/users/:id/comments/:id');
      let url2 = new Locflow.Url('/users/10/comments/10');
      let matchUrl = function() {
        return url1.matchPath(url2);
      };
      expect(matchUrl).to.throw(/has multiple named params \[:id\]/);
    });
  });

  describe('#matchHash', function() {
    let testCases = [
      ['#latest', '#latest', {}], 
      ['#foo&bar', '#foo&bar', {}], 
      ['#foo=:id', '#foo=50', { id: '50' }], 
      ['#id=:id&comment=:comment_id', '#id=10&comment=20', { id: '10', comment_id: '20' }],
      ['#foo&bar=:bar', '#foo&bar=10', { bar: '10' }], 
      ['#foo&bar=:bar', '#qux&bar=10', { bar: '10' }], 
      ['#foo=bar', '#foo=bar', {}], 
      ['#foo=bar', '#foo=qux', false], 
      ['#foo=:id', '#', false], 
      ['#foo=:id', '#foo', false], 
      ['#foo=:id', '#qux=10', false]
    ];

    it('works on the given test cases', function() {
      for (i = 0, len = testCases.length; i < len; i++) {
        let testCase = testCases[i];
        let url1 = new Locflow.Url(testCase[0]);
        let url2 = new Locflow.Url(testCase[1]);
        let errorMessage = url1.toString() + "\n" + url2.toString() + "\nshould match hash";
        expect(url1.matchHash(url2), errorMessage).to.eql(testCase[2]);
      }
    });

    it('throws an error if two placeholders have the same name', function() {
      let url1 = new Locflow.Url('#foo=:id&bar=:id');
      let url2 = new Locflow.Url('#foo=10&bar=20');
      let matchUrl = function() {
        return url1.matchHash(url2);
      };
      expect(matchUrl).to["throw"](/has multiple params \[:id\]/);
    });
  });

});
