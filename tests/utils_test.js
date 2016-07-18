describe('Locflow utils', () => {
  describe('.cloneArray', () => {
    it('retunrs a different array from the given', () => {
      let source = [1];
      let cloned = Locflow.cloneArray(source);
      expect(source).not.to.eq(cloned);
      expect(source).to.deep.eql(cloned);
    });

    it('keeps the same reference values', () => {
      let obj = {};
      let source = [obj];
      let cloned = Locflow.cloneArray(source);
      expect(source).not.to.eq(cloned);
      expect(source[0]).to.eq(cloned[0]);
    });
  });

  describe('.mergeObjects', () => {
    it('returns an object with properties from both arguments', function() {
      let obj = Locflow.mergeObjects({ a: 10 }, { b: 20 });
      expect(obj).to.eql({
        a: 10,
        b: 20
      });
    });

    it('overwrites the value from the second object with value from the first', () => {
      let obj = Locflow.mergeObjects({ a: 10 }, { a: 20 });
      expect(obj).to.eql({ a: 10 });
    });

    it('doesnt modify the given objects', () => {
      let first = { a: 10 };
      let second = { b: 20 };
      let merged = Locflow.mergeObjects(first, second);
      expect(first).to.eql({ a: 10 });
      expect(second).to.eql({ b: 20 });
      expect(merged).to.eql({ a: 10, b: 20 });
    });

    it('shallow copies each value', () => {
      let first = {
        a: { b: 20 }
      };
      let merged = Locflow.mergeObjects(first, {});
      expect(merged).to.eql({
        a: { b: 20 }
      });
      return expect(merged.a).to.eq(first.a);
    });

    it('ignores if the first argument isnt an object', () => {
      let merged = Locflow.mergeObjects(null, { a: 10 });
      expect(merged).to.eql({ a: 10 });
    });

    it('ignores if the second argument isnt an object', () => {
      let merged = Locflow.mergeObjects({ a: 10 }, null);
      return expect(merged).to.eql({ a: 10 });
    });
  });
});
