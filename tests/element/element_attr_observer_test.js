describe('Locflow.Element observer test', () => {
  let elm
  beforeEach(() => {
    elm = Locflow.era.element(`
      <button class="btn" name="foo">Hello</button>
    `);
  });

  it('notifies when a property changes', (done) => {
    elm.observe('name', (newValue, oldValue) => {
      expect(newValue).to.eq('bar');
      expect(oldValue).to.eq('foo');
      done();
    });
    elm.attr('name', 'bar');
  })

  it('calls multiple observer handlers for the same property', (done) => {
    let called = 0;
    elm.observe('name', val => { called += 1 });
    elm.observe('name', val => { called += 1 });
    elm.attr('name', 'bar');
    setTimeout(() => {
      expect(called).to.eq(2);
      done();
    });
  });

  it('calls observer for class', (done) => {
    elm.observe('class', (newValue) => {
      expect(newValue).to.eq('btn foo');
      done();
    });
    elm.addClass('foo');
  });

  it('calls observer for non existing attributes', (done) => {
    elm.observe('data-behaviour', (newValue) => {
      expect(newValue).to.eq('my-value');
      done();
    });
    elm.attr('data-behaviour', 'my-value');
  });
});
