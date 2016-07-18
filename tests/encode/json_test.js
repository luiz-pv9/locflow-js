describe('Locflow.Encode.Json specs', () => {
  describe('#generateFlatArray', () => {
    it('inserts an entry for each key in the JSON', () => {
      let encode = new Locflow.Encode.Json({ name: 'luiz', age: 10 });
      expect(encode.generateFlatArray()).to.deep.eql([
        { key: ['name'], value: 'luiz' },
        { key: ['age'], value: 10 }
      ]);
    });

    it('keeps array values as arrays', () => {
      let encode = new Locflow.Encode.Json({ colors: ['red', 'blue'] });
      expect(encode.generateFlatArray()).to.deep.eql([
        { key: ['colors'], value: ['red', 'blue'] }
      ]);
    });

    it('parses nested objects keys', () => {
      let encode = new Locflow.Encode.Json({
        author: { name: 'Luiz' }
      });
      expect(encode.generateFlatArray()).to.deep.eql([
        { key: ['author', 'name'], value: 'Luiz' }
      ]);
    });

    it('parses multiple nested object keys', () => {
      let encode = new Locflow.Encode.Json({
        author: { name: 'Luiz' }, post: { title: 'Title' }
      });
      expect(encode.generateFlatArray()).to.deep.eql([
        { key: ['author', 'name'], value: 'Luiz' },
        { key: ['post', 'title'], value: 'Title' }
      ]);
    });

    it('parses deep nested object keys', () => {
      let encode = new Locflow.Encode.Json({
        post: { author: { name: { first: 'Luiz' } } }
      });
      expect(encode.generateFlatArray()).to.deep.eql([
        { key: ['post', 'author', 'name', 'first'], value: 'Luiz' }
      ]);
    });
  });

  describe('#encodeKeyValuePair', () => {
    let encode = null;
    beforeEach(() => {
      encode = new Locflow.Encode.Json({});
    });

    it('uses the key if there is only one step', () => {
      let query = encode.encodeKeyValuePair({
        key: ['name'], value: 'luiz'
      });
      expect(query).to.deep.eql(['name=luiz']);
    });

    it('wraps other keys in brackets', () => {
      let query = encode.encodeKeyValuePair({
        key: ['author', 'name'], value: 'luiz'
      });
      expect(query).to.deep.eql(['author[name]=luiz']);

      query = encode.encodeKeyValuePair({
        key: ['post', 'author', 'name'], value: 'luiz'
      });
      expect(query).to.deep.eql(['post[author][name]=luiz']);
    });

    it('inserts empty brackets if value is an array', () => {
      let query = encode.encodeKeyValuePair({
        key: ['colors'], value: ['red']
      });
      expect(query).to.deep.eql(['colors[]=red']);

      query = encode.encodeKeyValuePair({
        key: ['user', 'colors'], value: ['blue']
      });
      expect(query).to.deep.eql(['user[colors][]=blue']);
    });

    it('inserts multiple entries for each value in the array', () => {
      let query = encode.encodeKeyValuePair({
        key: ['colors'], value: ['red', 'blue']
      });
      expect(query).to.deep.eql([
        'colors[]=red', 'colors[]=blue'
      ]);

      query = encode.encodeKeyValuePair({
        key: ['user', 'colors'], value: ['red', 'blue']
      });
      expect(query).to.deep.eql([
        'user[colors][]=red', 'user[colors][]=blue'
      ]);
    });
  });

  describe('#toQueryString', () => {
    it('encodes an empty object to an empty string', () => {
      let encode = new Locflow.Encode.Json({});
      expect(encode.toQueryString()).to.eq('');
    });

    it('encodes single key-value pair', () => {
      let encode = new Locflow.Encode.Json({name: 'luiz'});
      expect(encode.toQueryString()).to.eql('name=luiz');
    });

    it('encodes multiple key-value pairs separated by &', () => {
      let encode = new Locflow.Encode.Json({
        name: 'luiz', age: 10
      });
      expect(encode.toQueryString()).to.eql('name=luiz&age=10');
    });

    it('encodes values with URI safe characters', () => {
      let encode = new Locflow.Encode.Json({name: ' Luiz '});
      expect(encode.toQueryString()).to.eql('name=%20Luiz%20');
    });

    it('encodes nested objects', () => {
      let encode = new Locflow.Encode.Json({
        user: { name: { first: 'Luiz' } }
      });
      expect(encode.toQueryString()).to.eql('user[name][first]=Luiz');
    });
  });
});
