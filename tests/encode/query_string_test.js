describe('Locflow.Encode.QueryString specs', () => {
  describe('#splitKeyValue', () => {
    let encode = null;
    beforeEach(() => {
      encode = new Locflow.Encode.QueryString('');
    })

    it('returns an object with `key` and `value`', () => {
      let pair = encode.splitKeyValue('name=luiz');
      expect(pair).to.deep.eql({
        key: 'name',
        value: 'luiz'
      });
    })

    it('returns undefined if there was a syntax error', () => {
      let pair = encode.splitKeyValue('name:luiz');
      expect(pair).to.be.undefined;
    })

    it('preserves key and value spaces', () => {
      let pair = encode.splitKeyValue(' name = luiz ');
      expect(pair).to.deep.eql({
        key: ' name ',
        value: ' luiz '
      });
    })

    it('decodes special URI characters', () => {
      let pair = encode.splitKeyValue('age=%2610%26');
      expect(pair).to.deep.eql({
        key: 'age',
        value: '&10&'
      });

      pair = encode.splitKeyValue('name=%20Luiz%20');
      expect(pair).to.deep.eql({
        key: 'name',
        value: ' Luiz '
      });
    })
  })

  describe('#generateFlatMap', () => {
    it('generates an object with keys from the querystring', () => {
      let encode = new Locflow.Encode.QueryString('name=luiz&age=10');
      let flatMap = encode.generateFlatMap();
      expect(flatMap).to.deep.eql({
        name: 'luiz',
        age: '10'
      });
    });

    it('uses the key exactly as it appears in the querystring(no trimming)', () => {
      let encode = new Locflow.Encode.QueryString(' name = luiz&age  =10');
      let flatMap = encode.generateFlatMap();
      expect(flatMap).to.deep.eql({
        ' name ': ' luiz',
        'age  ': '10'
      });
    });

    it('stores keys as flat values with brackets', () => {
      let encode = new Locflow.Encode.QueryString('author[name][first]=luiz');
      let flatMap = encode.generateFlatMap();
      expect(flatMap).to.deep.eql({
        'author[name][first]': 'luiz'
      });
    });

    it('stores multiple values for the same key as an array', () => {
      let encode = new Locflow.Encode.QueryString('color=red&color=blue');
      let flatMap = encode.generateFlatMap();
      expect(flatMap).to.deep.eql({
        color: ['red', 'blue']
      });
    });

    it('stores multiple values if the key has empty brackets at the end', () => {
      let encode = new Locflow.Encode.QueryString('color[]=red&color[]=blue');
      let flatMap = encode.generateFlatMap();
      expect(flatMap).to.deep.eql({
        'color[]': ['red', 'blue']
      });
    });

    it('stores multiple values for nested keys', () => {
      let encode = new Locflow.Encode.QueryString('a[b]=10&a[b]=20&a[b]=30');
      let flatMap = encode.generateFlatMap();
      expect(flatMap).to.deep.eql({
        'a[b]': ['10', '20', '30']
      });
    });

    it('ignores bad formatted key-value pairs', () => {
      let encode = new Locflow.Encode.QueryString('name=foo&age:10');
      let flatMap = encode.generateFlatMap();
      expect(flatMap).to.deep.eql({
        name: 'foo'
      });
    });

    it('stores single value as array if key ends with []', () => {
      let encode = new Locflow.Encode.QueryString('color[]=red');
      let flatMap = encode.generateFlatMap();
      expect(flatMap).to.deep.eql({
        'color[]': ['red']
      });
    });
  });

  describe('#findNestedPath', () => {
    let encode = null;
    beforeEach(() => {
      encode = new Locflow.Encode.QueryString('');
    });

    it('returns the same key if there is no nesting', () => {
      expect(encode.findNestedPath('name')).to.deep.eql(['name']);
    });

    it('returns an array with each path', () => {
      expect(encode.findNestedPath('author[name]')).to.deep.eql([
        'author', 'name'
      ]);
    });

    it('returns an array with multiple paths', () => {
      expect(encode.findNestedPath('post[author][name][first]')).to.deep.eql([
        'post', 'author', 'name', 'first'
      ]);
    });

    it('returns the given key if it is invalid', () => {
      expect(encode.findNestedPath('author[na]me]')).to.deep.eql([
        'author[na]me]'
      ]);
    });

    it('removes empty brackets at the end of the key', () => {
      expect(encode.findNestedPath('colors[]')).to.deep.eql(['colors']);
      expect(encode.findNestedPath('author[colors][]')).to.deep.eql([
        'author', 'colors'
      ]);
    });
  });

  describe('#assignNestedValue', () => {
    let encode = null;
    beforeEach(() => {
      encode = new Locflow.Encode.QueryString('');
    });

    it('stores the given key -> value in the map', () => {
      let nestedMap = encode.assignNestedValue({}, ['name'], 'Luiz');
      expect(nestedMap).to.deep.eql({name: 'Luiz'});
    });

    it('stores the given key paths as nested objects', () => {
      let nestedMap = encode.assignNestedValue({}, ['author', 'name'], 'Luiz');
      expect(nestedMap).to.deep.eql({
        author: {
          name: 'Luiz'
        }
      });
    });

    it('preserves existing values in the object', () => {
      let obj = {
        author: { age: '10' }
      };
      let nestedMap = encode.assignNestedValue(obj, ['author', 'name'], 'Luiz');
      expect(nestedMap).to.deep.eql({
        author: {
          age: '10',
          name: 'Luiz'
        }
      });
    });
  });

  describe('#toJson', () => {
    it('parses the values as string', () => {
      let encode = new Locflow.Encode.QueryString('name=luiz&age=10&switch=on');
      expect(encode.toJson()).to.deep.eql({
        'name': 'luiz',
        'age': '10',
        'switch': 'on'
      });
    });

    it('encodes nested properties', () => {
      let encode = new Locflow.Encode.QueryString('card[name]=foo&card[age]=10');
      expect(encode.toJson()).to.deep.eql({
        card: {
          name: 'foo',
          age: '10'
        }
      });
    });

    it('encodes multiple values for the same key', () => {
      let encode = new Locflow.Encode.QueryString('color=red&color=blue');
      expect(encode.toJson()).to.deep.eql({
        color: ['red', 'blue']
      });
    });

    it('ignores bad formatted key-value pairs', () => {
      let encode = new Locflow.Encode.QueryString('name=foo&age10&color=red');
      expect(encode.toJson()).to.deep.eql({
        name: 'foo',
        color: 'red'
      });
    });

    it('encodes "deep" nested properties', () => {
      let encode = new Locflow.Encode.QueryString('post[author][name][first]=Luiz');
      expect(encode.toJson()).to.deep.eql({
        post: { author: { name: { first: 'Luiz' } } }
      });
    });

    it('encodes nested arrays', () => {
      let encode = new Locflow.Encode.QueryString('a[b]=10&a[b]=20&a[b]=30');
      expect(encode.toJson()).to.deep.eql({
        a: { b: ['10', '20', '30'] }
      });
    });

    it('parses a single element with brackets in the key as array', () => {
      let encode = new Locflow.Encode.QueryString('colors[]=red');
      expect(encode.toJson()).to.deep.eql({
        colors: ['red']
      });
    });

    it('decodes special URI characters', () => {
      let encode = new Locflow.Encode.QueryString('name=%20Luiz%20');
      expect(encode.toJson()).to.deep.eql({
        name: ' Luiz '
      });
    });
  });

  describe('#isValid', () => {
    it('returns true for at least one key-value pairs', () => {
      let encode = new Locflow.Encode.QueryString('name=luiz');
      expect(encode.isValid()).to.be.true;

      encode = new Locflow.Encode.QueryString('name=luiz&age=10');
      expect(encode.isValid()).to.be.true;
    });

    it('returns false if there is no key value pairs', () => {
      let encode = new Locflow.Encode.QueryString('latest');
      expect(encode.isValid()).to.be.false;

      encode = new Locflow.Encode.QueryString('foo:bar');
      expect(encode.isValid()).to.be.false;
    });

    it('still returns true if some of the key-value pair arent valid', () => {
      let encode = new Locflow.Encode.QueryString('name=luiz&age:10');
      expect(encode.isValid()).to.be.true;
    });
  });
})
