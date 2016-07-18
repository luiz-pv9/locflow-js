describe('Locflow.Cache specs', () => {
  let cache = null;
  beforeEach(() => {
    cache = new Locflow.Cache();
  });

  describe('#set and #get', () => {
    it('stores the given value associated with key', () => {
      cache.put('name', 'luiz');
      cache.put('number', 100);
      cache.put('colors', ['red', 'blue']);

      expect(cache.get('name')).to.eq('luiz');
      expect(cache.get('number')).to.eq(100);
      expect(cache.get('colors')).to.deep.eql(['red', 'blue']);
    });

    it('overwrites existing values', () => {
      cache.put('name', 'luiz');
      cache.put('name', 'paulo');
      expect(cache.get('name')).to.eq('paulo');
    });

    it('stores NULL values (null !== undefined)', () => {
      cache.put('my-null', null);
      expect(cache.get('my-null')).to.be.null;
      expect(cache.get('my-undefined')).to.be.undefined;
    });

    it('returns the given default if value wasnt found', () => {
      expect(cache.get('my-value', 10)).to.eq(10);
      cache.put('my-value', null);
      expect(cache.get('my-value', 10)).to.be.null;
    });
  });

  describe('#remove', () => {
    it('deletes the value associated with `key`', () => {
      cache.put('name', 'luiz');
      expect(cache.remove('name')).to.eq('luiz');
      expect(cache.get('name')).to.be.undefined;
    });

    it('ignores if the key doesnt exist', () => {
      expect(cache.remove('my-undefined')).to.be.undefined;
    });
  });

  describe('#removeAll', () => {
    it('removes all entries in the cache', () => {
      cache.put('name', 'luiz');
      cache.put('number', 100);
      cache.removeAll();
      expect(cache.get('name')).to.be.undefined;
      expect(cache.get('number')).to.be.undefined;
    });
  });

  describe('#setSize', () => {
    it('removes oldest items if limit is exceeded', () => {
      cache.setSize(2);
      cache.put('name', 'Luiz');
      cache.put('color', 'red');
      cache.put('email', 'luizpvasc@gmail.com'); // removing name
      expect(cache.get('name')).to.be.undefined;
      expect(cache.get('color')).to.eq('red');
      cache.put('pet', 'cat'); // removing color
      expect(cache.get('color')).to.be.undefined;
    });

    it('removes oldest items when limit is updated', () => {
      cache.put('name', 'luiz');
      cache.put('color', 'red');
      cache.put('email', 'luizpvasc@gmail.com');
      cache.put('pet', 'cat');
      
      cache.setSize(2);
      expect(cache.get('name')).to.be.undefined;
      expect(cache.get('color')).to.be.undefined;
      expect(cache.get('email')).to.eq('luizpvasc@gmail.com');
      expect(cache.get('pet')).to.eq('cat');
    });
  });

  describe('#expire', function() {
    it('removes the cache after timeout', (done) => {
      cache.put('my-key', 'my-value', { expire: 5 });
      setTimeout(function() {
        expect(cache.get('my-key')).to.be.undefined;
        done();
      }, 6);
    });

    it('removes the timeout of the key is updated', (done) => {
      cache.put('my-key', 'my-value', { expire: 5 });
      cache.put('my-key', 'my-updated-value');
      setTimeout(function() {
        expect(cache.get('my-key')).to.eq('my-updated-value');
        done();
      }, 6);
    });
  });
});
